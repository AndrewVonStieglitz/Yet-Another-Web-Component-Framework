import { createServer } from "http";
import { readFile, watch, existsSync } from "fs";
import { join, resolve } from "path";
import { WebSocketServer } from "ws";

const srcDir = "./client";
const defaultFile = "index.html";
const hmrScriptTag = /*html*/ `
<script>
  const ws = new WebSocket("ws://localhost:3000");
  ws.onmessage = (message) => {
    if (message.data === "reload") {
      window.location.reload();
    }
  };
</script>
`;

const server = createServer((req, res) => {
  let normalizedUrl;
  if (req.url) {
    normalizedUrl = req.url.endsWith("/")
      ? `${req.url}${defaultFile}`
      : req.url;
  } else {
    normalizedUrl = `/${defaultFile}`;
  }
  normalizedUrl = normalizedUrl === "/" ? `/${defaultFile}` : normalizedUrl;

  let safePath = join(srcDir, normalizedUrl);
  let fullPath = resolve(safePath);

  // Function to serve file
  const serveFile = (path) => {
    readFile(path, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      let content = data;
      const contentType = getContentType(path);
      if (contentType === "text/html") {
        content = Buffer.from(
          data.toString().replace("</body>", `${hmrScriptTag}</body>`)
        );
      }
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    });
  };

  // Check if the path is a directory or has no extension (i.e., potentially an HTML file)
  if (!fullPath.startsWith(resolve(srcDir)) || !existsSync(fullPath)) {
    // Attempt to serve .html if no extension is provided
    if (!fullPath.includes('.')) {
      safePath += '.html';
      fullPath = resolve(safePath);
      if (existsSync(fullPath) && fullPath.startsWith(resolve(srcDir))) {
        serveFile(fullPath);
        return;
      }
    }

    res.writeHead(404);
    res.end("Not Found");
    return;
  }

  // Verify the path starts with the src directory path
  if (!fullPath.startsWith(resolve(srcDir))) {
    res.writeHead(403);
    res.end("Access Denied");
    return;
  }

  serveFile(fullPath);
});


const getContentType = (filePath) => {
  const extension = filePath.split(".").pop();
  const contentTypes = {
    html: "text/html",
    js: "application/javascript",
    css: "text/css",
    json: "application/json",
    png: "image/png",
    jpg: "image/jpeg",
    svg: "image/svg+xml",
    // Add more MIME types as needed
  };
  return contentTypes[extension] || "application/octet-stream";
};

const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

// Notify clients to reload when any file in the src directory changes
const notifyClientsToReload = () => {
  wss.clients.forEach((client) => {
    client.send("reload");
  });
};

// Watch the src directory for changes
watch(srcDir, { recursive: true }, (eventType, filename) => {
  if (filename) {
    notifyClientsToReload();
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
