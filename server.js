const dgram = require("dgram");
const server = dgram.createSocket("udp4");

const server_port = process.env.SERVER_PORT || 5000;

// Log any error with connection
server.on("error", (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

// Message recieved on port
server.on("message", (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

// Socket started listening
server.on("listening", () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

// Bind server socket to port
server.bind(server_port);
