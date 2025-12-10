// server.js
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const { getMetrics } = require("./metrics");
const { streamLogs } = require("./logs");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve frontend folder
app.use(express.static(path.join(__dirname, "..", "frontend")));

const clients = new Set();

wss.on("connection", (ws) => {
  console.log("Client connected");
  clients.add(ws);

  ws.on("close", () => {
    console.log("Client disconnected");
    clients.delete(ws);
  });
});

// Broadcast helper
function broadcast(obj) {
  const msg = JSON.stringify(obj);
  for (const ws of clients) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(msg);
    }
  }
}

// Send metrics every 1 second
setInterval(async () => {
  const metrics = await getMetrics();

  broadcast({ type: "metrics", data: metrics });

  if (metrics.cpuPercent > 80) {
    broadcast({
      type: "alert",
      data: { message: `⚠ CPU HIGH: ${metrics.cpuPercent}%` }
    });
  }
}, 1000);

// ---------- LOG STREAMING ----------
const LOG_FILE_PATH = path.join(__dirname, "example.log"); 
// change this to any real log file you want

streamLogs(LOG_FILE_PATH, (line) => {
  broadcast({ type: "log", data: { line, timestamp: Date.now() } });
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// every second the server:-
// 1.Checks health
// 2.Broadcasts health to all the browsers
// 3.Warns if CPU is too High 
// 4.Read new lines and sends them instantly