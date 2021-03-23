const dgram = require("dgram");
const client = dgram.createSocket("udp4");

const client_port = process.env.CLIENT_PORT || getRandom(5000, 5100);

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Log any error with connection
client.on("error", (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

// Message recieved on port
client.on("message", (msg, rinfo) => {
  console.log(`client got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

// Socket started listening
client.on("listening", () => {
  const address = client.address();
  console.log(`client listening ${address.address}:${address.port}`);
});

// UDP connection is established
client.on("connect", () => {
  console.log("connected");

  const message = Buffer.from("Some bytes from client");
  client.send(message, 5000, "127.0.0.1");
});

// Bind client socket to port
client.bind(client_port);

client.connect(5000, "127.0.0.1");
