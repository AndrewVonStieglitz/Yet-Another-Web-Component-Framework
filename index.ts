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
  // Prevent directory traversal vulnerability
  let normalizedUrl: string;
  if (req.url) {
    normalizedUrl = req.url.endsWith("/")
      ? `${req.url}${defaultFile}`
      : req.url;
  } else {
    normalizedUrl = `/${defaultFile}`;
  }
  normalizedUrl = normalizedUrl === "/" ? `/${defaultFile}` : normalizedUrl; // Handle root URL

  const safePath = join(srcDir, normalizedUrl);
  const fullPath = resolve(safePath);

  // Verify that the resolved path starts with the absolute path to the src directory
  if (!fullPath.startsWith(resolve(srcDir))) {
    res.writeHead(403);
    res.end("Access Denied");
    return;
  }

  // Serve the file if it exists
  if (existsSync(fullPath)) {
    readFile(fullPath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      let content: Buffer = data; // Convert content to Buffer
      const contentType = getContentType(fullPath);
      // If the file is an HTML file, append the HMR script tag before the closing body tag
      if (contentType === "text/html") {
        content = Buffer.from(
          data.toString().replace("</body>", `${hmrScriptTag}</body>`)
        ); // Convert content to Buffer
      }
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    });
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
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
