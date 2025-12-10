const { Tail } = require("tail"); // it is the watcher

function streamLogs(filePath, onLine) {
  
  // Create a watcher for the log file
  const tail = new Tail(filePath, {
    useWatchFile: true // watch if new line comes in
  });

  // When a NEW LINE is added in the log file
  tail.on("line", (line) => {
    onLine(line); // send the new line to whoever called this function
  });

  // If there is an ERROR watching the file
  tail.on("error", (err) => {
    console.error("Tail error:", err); // show the error message
  });

  return tail; // return the watcher
}

module.exports = { streamLogs };
