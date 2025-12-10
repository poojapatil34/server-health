// Connect WebSocket to backend
const ws = new WebSocket(`ws://${location.host}`);

ws.onopen = () => console.log("WS Connected");
ws.onclose = () => console.log("WS Disconnected");

// UI references
const cpuVal = document.getElementById("cpuVal");
const ramVal = document.getElementById("ramVal");
const diskVal = document.getElementById("diskVal");

const cpuBar = document.getElementById("cpuBar");
const ramBar = document.getElementById("ramBar");
const diskBar = document.getElementById("diskBar");

const timeSpan = document.getElementById("time");
const alertDiv = document.getElementById("alert");
const logsDiv = document.getElementById("logs");

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);

  if (msg.type === "metrics") {
    updateMetrics(msg.data);
  }

  if (msg.type === "alert") {
    showAlert(msg.data.message);
  }

  if (msg.type === "log") {
    addLog(msg.data.line);
  }
};

function updateMetrics(m) {
  cpuVal.textContent = m.cpuPercent + "%";
  ramVal.textContent = m.ramPercent + "%";
  diskVal.textContent = m.diskPercent + "%";

  cpuBar.style.width = m.cpuPercent + "%";
  ramBar.style.width = m.ramPercent + "%";
  diskBar.style.width = m.diskPercent + "%";

  timeSpan.textContent = new Date(m.timestamp).toLocaleTimeString();
}

function showAlert(message) {
  alertDiv.textContent = message;
  setTimeout(() => (alertDiv.textContent = ""), 4000);
}

function addLog(line) {
  if (!line) return;
  const div = document.createElement("div");
  div.textContent = line;
  logsDiv.appendChild(div);
  logsDiv.scrollTop = logsDiv.scrollHeight;
}
