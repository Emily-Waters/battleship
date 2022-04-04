require("dotenv").config();
const { r } = require("./constants");
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

//-------------------------------------------------CONNECT USER---------------------------------------------------------
io.on("connection", (socket) => {
  console.log(chalk.magenta("\nClient Connected"), chalk.yellowBright(socket.id));
  users[socket.id] = { name: socket.handshake.query.name, socket: socket.id };
  serverStatus(users);

  socket.on("dispatch", (action) => {
    dispatch(socket, action);
  });

  //----------------------------------------------DISCONNECT USER-------------------------------------------------------
  socket.on("disconnect", (reason) => {
    console.log(users[socket.id], ` - disconnected - ${reason}`);
    delete users[socket.id];
    delete waitingForMatch[socket.id];
    serverStatus(users);
  });
});

function dispatch(socket, { type, value }) {
  console.log("\nSocket : ", socket.id);
  console.log("Type   : ", type);
  console.log("Value  : ", value);

  switch (type) {
    case "FORFEIT_MATCH":
      delete matches[value.id];
      value.players.forEach((player) => {
        value.winner = player.socket !== socket.id;
        io.to(player.socket).emit("dispatch", [
          { type: "SET_LAST_MATCH", value },
          { type: "SET_STATUS", value: "DEBRIEF" },
        ]);
      });

      break;

    case "FIND_MATCH":
      waitingForMatch[socket.id] = users[socket.id];
      const { action } = gameMatcher();
      if (action) {
        action.forEach(({ players }) => {
          players.forEach(({ socket }) => {
            delete waitingForMatch[socket];
            io.to(socket).emit("dispatch", action);
          });
        });
      } else {
        io.to(socket.id).emit("dispatch", [{ type: "SET_STATUS", value: "WAITING" }]);
      }

      break;

    case "CANCEL_MATCH":
      delete waitingForMatch[socket.id];
      io.to(socket.id).emit("dispatch", [{ type: "SET_STATUS", value: null }]);

      break;

    default:
      break;
  }
}
//-------------------------------------------------MATCH USERS----------------------------------------------------------
function gameMatcher() {
  const waitingArray = Object.values(waitingForMatch);

  if (waitingArray.length >= 2) {
    const id = generateMatchID();
    const match = waitingArray.splice(0, 2);
    matches[id] = { id, players: match };
    return {
      action: [
        { type: "SET_MATCH", value: matches[id], players: matches[id].players },
        { type: "SET_STATUS", value: "PLAYING", players: matches[id].players },
      ],
    };
  } else {
    return { action: null };
  }
}

function generateMatchID() {
  return Array.from(Array(6))
    .map(() => {
      return String.fromCharCode(Math.floor(Math.random() * 78) + 48);
    })
    .join("");
}
//-------------------------------------------------SERVER STATUS--------------------------------------------------------
function serverStatus(users) {
  // console.clear();
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
