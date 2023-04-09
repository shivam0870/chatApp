const express = require("express")
const { Server } = require("socket.io");
var http = require('http');
const cors = require("cors")
const path = require("path");
const app = express()
app.use(cors())

var server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

//app.get("/", (req, res) => {res.send("Chat BE with Socket.io by Prince Raj"); res.end()})

io.on("connection", (socket) => {
  console.log(socket.id)

  socket.on("joinRoom", room => {
		socket.join(room)
  })

  socket.on("newMessage", ({newMessage, room}) => {
    io.in(room).emit("getLatestMessage", newMessage)
  })

});

const port = process.env.PORT || 9000
if (process.env.NODE_ENV === "production") {
  app.use(express.static("Client/build"));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname + "/Client/build/index.html"),
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );
  });
}
server.listen(port, console.log(`App started at port ${port}`))