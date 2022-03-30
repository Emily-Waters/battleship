require("dotenv").config();
const db = require("./db/index");
const bcrypt = require("bcryptjs");
const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;

const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const server = http.createServer(app);

const usersRoutes = require("./routes/users");
// app.use("/api/users", usersRoutes);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("client connected: ", socket.id);

  socket.on("disconnect", (reason) => {
    console.log(reason);
  });
});

server.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log("Server running on Port: ", PORT);
});
