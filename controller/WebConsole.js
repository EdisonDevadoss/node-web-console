var driver, ssh;

driver = require("node-ssh");

ssh = new driver();

const sshConfig = {
  host: "ci.codingtown.com",
  username: "ubuntu",
  privateKey: "/home/codingtown/Downloads/ct-dev-tools.pem"
};

module.exports = async (ws, req) => {
  await ssh.connect(sshConfig);
  const shellStream = await ssh.requestShell();
  ws.on("message", msg => {
    const data = JSON.parse(msg);
    switch (data.method) {
      case "command":
        shellStream.write(data.command.trim() + "\n");
        break;
    }
  });
  // listener
  shellStream.on("data", data => {
    const d = JSON.stringify({
      jsonrpc: "2.0",
      data: data.toString()
    });
    ws.send(d);
  });
  shellStream.stderr.on("data", data => {
    const d = JSON.stringify({
      jsonrpc: "1.0",
      data: data.toString()
    });
    ws.send(d);
  });
};
