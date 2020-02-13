var driver, ssh;

driver = require("node-ssh");

ssh = new driver();

const sshConfig = {
  host: "ci.codingtown.com",
  username: "ubuntu",
  privateKey: "/home/codingtown/Downloads/ct-dev-tools.pem"
};

async function myVeryCoolAsyncFunction() {
  await ssh.connect(sshConfig);
  const defaultDirectory = await ssh.exec("pwd", [], { stream: "stdout" });
  const shellStream = await ssh.requestShell();

  const stdin = process.openStdin();
  stdin.addListener("data", data => {
    shellStream.write("ls" + "\n");
  });
  shellStream.on("data", data => {
    process.stdout.write(data);
  });
  shellStream.stderr.on("data", data => {
    process.stdout.write(data);
  });
}
myVeryCoolAsyncFunction()
  .then(function() {
    console.log("all done");
  })
  .catch(function(error) {
    console.log("encountered an error", error);
  });
