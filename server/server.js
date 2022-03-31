require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("./db/index");
const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const usersRoutes = require("./routes/users");
const bodyParser = require("body-parser");
const PORT = process.env.SERVER_PORT || 5000;
const chalk = require("chalk");
const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use("/api/users", usersRoutes);

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const userPool = {};

io.on("connection", (socket) => {
  console.log(chalk.magenta("client connected"), chalk.yellowBright(socket.id));

  userPool[socket.id] = socket.handshake.query.name;
  io.emit("user", userPool);
  console.log(`${userPool[socket.id]} - connected`);
  console.log("User Pool : ", userPool);

  socket.on("disconnect", (reason) => {
    console.log(`${userPool[socket.id]} - disconnected - ${reason}`);
    delete userPool[socket.id];
    console.log("User Pool : ", userPool);
    io.emit("user", userPool);
  });
});

server.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(chalk.green(`\nServer running on port : ${chalk.yellow(PORT)}`));
});
