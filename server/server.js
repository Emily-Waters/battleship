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

const users = {};
const waitingForMatch = {};
const matches = {};
let matchID = 0;

//-------------------------------------------------CONNECT USER---------------------------------------------------------
io.on("connection", (socket) => {
  console.log(chalk.magenta("\nClient Connected"), chalk.yellowBright(socket.id), "\t\t\t\t");
  users[socket.id] = { name: socket.handshake.query.name, socket: socket.id };
  serverStatus(users);

  //----------------------------------------------JOIN MATCH POOL-------------------------------------------------------
  socket.on("findmatch", () => {
    waitingForMatch[socket.id] = users[socket.id];
    gameMatcher();
  });
  //------------------------------------------------CANCEL MATCH--------------------------------------------------------
  socket.on("cancelmatch", ({ id }) => {
    const match = matches[id];
    delete waitingForMatch[match.firstPlayer];
    delete waitingForMatch[match.secondPlayer];
    io.to(match.firstPlayer).emit("matchover");
    delete matches[id];
  });
  //----------------------------------------------DISCONNECT USER-------------------------------------------------------
  socket.on("disconnect", (reason) => {
    console.log(users[socket.id], ` - disconnected - ${reason}\t\t\t\t`);
    delete users[socket.id];
    delete waitingForMatch[socket.id];
    serverStatus(users);
  });
});
//-------------------------------------------------MATCH USERS----------------------------------------------------------
function gameMatcher() {
  const waitingArray = Object.values(waitingForMatch);
  if (waitingArray.length >= 2) {
    const match = waitingArray.splice(0, 2);
    const id = generateMatchID();
    matches[id] = { id, players: match };
    match.forEach((user, i) => {
      delete waitingForMatch[user.socket];
      io.to(user.socket).emit("findmatch", {
        match: matches[id],
      });
    });
  }
}

function generateMatchID() {
  return Array.from(Array(6))
    .map(() => {
      return String.fromCharCode(Math.floor(Math.random() * 78) + 48);
    })
    .join("");
}
function serverStatus(users) {
  console.clear();
  console.log("Server     : ", chalk.green("connected"));
  console.log("Port       : ", chalk.yellow(PORT));
  console.log("# of Users : ", Object.keys(users).length);
  console.log(
    "Users      :",
    Object.keys(users)
      .map((user, i) => `\n ${i}. ${chalk.magenta(user)}`)
      .join("")
  );
}

server.listen(PORT, (err) => {
  if (!err) {
    console.log(chalk.green(`\nServer running on port : ${chalk.yellow(PORT)}`));
    serverStatus(io);
  } else {
    console.log(err);
  }
});
