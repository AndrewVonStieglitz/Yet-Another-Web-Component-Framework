import { createServer } from "http";
import { readFile, watch, existsSync, PathOrFileDescriptor } from "fs";
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

  if (req.url === "/random-number") {
    const randomNumber = Math.floor(Math.random() * 10) + 1; // Generates a number between 1 and 10
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ number: randomNumber }));
    return; // Prevent further processing
  }
  
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

  const serveFile = (path: PathOrFileDescriptor) => {
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

  if (!fullPath.startsWith(resolve(srcDir)) || !existsSync(fullPath)) {
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
  };
  return contentTypes[extension] || "application/octet-stream";
};

const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

const notifyClientsToReload = () => {
  wss.clients.forEach((client) => {
    client.send("reload");
  });
};

watch(srcDir, { recursive: true }, (eventType, filename) => {
  if (filename) {
    notifyClientsToReload();
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
