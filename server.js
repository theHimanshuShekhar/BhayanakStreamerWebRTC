const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const server_port = process.env.SERVER || 5000;

io.on("connection", (socket) => {
  console.log("a user connected - [" + socket.id + "]");
});

http.listen(server_port, () => {
  console.log("listening on *:" + server_port);
});
