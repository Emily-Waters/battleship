require("dotenv").config();
const { r, s } = require("./constants");
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
  users[socket.id] = { name: socket.handshake.query.name, socket: socket.id, isReady: false };
  serverStatus(users);
  //----------------------------------------------DISPATCH ACTIONS------------------------------------------------------
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
//------------------------------------------------DEFINE DISPATCH-------------------------------------------------------
function dispatch(socket, { type, value }) {
  console.log("\nSocket : ", socket.id);
  console.log("Type   : ", type);

  switch (type) {
    case s.TARGET_CELL:
      const X = value.XY[0];
      const Y = value.XY[1];
      let thisPlayer = matches[value.match.id].players.find((player) => player.socket === socket.id);
      let otherPlayer = matches[value.match.id].players.find((player) => player.socket !== socket.id);

      thisPlayer.targetBoard[Y][X].isTarget = true;
      otherPlayer.board[Y][X].isTarget = true;

      if (otherPlayer.board[Y][X].isOccupied) {
        thisPlayer.targetBoard[Y][X].isHit = true;
        otherPlayer.board[Y][X].isHit = true;
        const shipName = otherPlayer.board[Y][X].occupiedBy;
        otherPlayer.ships
          .find((ship) => ship.name === shipName)
          .sections.forEach((section) => {
            if (section.XY[0] === X && section.XY[1] === Y) {
              section.isHit = true;
            }
          });
      }

      matches[value.match.id].players = [thisPlayer, otherPlayer];

      matches[value.match.id].players.forEach((player) => {
        io.to(player.socket).emit("dispatch", [
          { type: r.SET_TURN, value: !player.turn },
          { type: r.SET_BOARD, value: { board: player.board, ships: player.ships } },
          { type: r.SET_TARGET_BOARD, value: player.targetBoard },
        ]);
      });

      break;
    case s.READY:
      matches[value.match.id].players.find((player) => player.socket === socket.id).board = value.board;
      matches[value.match.id].players.find((player) => player.socket === socket.id).ships = value.ships;
      matches[value.match.id].players.find((player) => player.socket === socket.id).targetBoard = value.targetBoard;
      matches[value.match.id].players.find((player) => player.socket === socket.id).isReady = true;
      if (matches[value.match.id].players.every((player) => player.isReady)) {
        matches[value.match.id].players.forEach((player, i) => {
          io.to(player.socket).emit("dispatch", [
            { type: r.SET_USER_STATUS, value: { status: "PLAYING", msg: "SHATTLEBIP!" } },
            { type: r.SET_BOARD, value: { board: player.board, ships: player.ships } },
          ]);
        });
      } else {
        io.to(socket.id).emit("dispatch", [
          { type: r.SET_USER_STATUS, value: { status: "READY", msg: "Waiting for opponent" } },
        ]);
      }

      break;
    case s.FORFEIT_MATCH:
      delete matches[value.id];
      value.players.forEach((player) => {
        value.details = player.socket !== socket.id ? "You Won! Opponent Forfeitted" : "You Lost! You Forfeitted";
        io.to(player.socket).emit("dispatch", [
          { type: r.SET_LAST_MATCH, value },
          { type: r.SET_USER_STATUS, value: { status: "DEBRIEF", msg: value.details } },
        ]);
      });

      break;

    case s.FIND_MATCH:
      waitingForMatch[socket.id] = users[socket.id];
      const { action } = gameMatcher();
      if (action) {
        action.forEach(({ players }) => {
          players.forEach((player) => {
            delete waitingForMatch[player.socket];
            player.isReady = false;
            io.to(player.socket).emit("dispatch", action);
          });
        });
      } else {
        io.to(socket.id).emit("dispatch", [
          { type: r.SET_USER_STATUS, value: { status: "WAITING", msg: "Finding An Opponent" } },
        ]);
      }

      break;

    case s.CANCEL_MATCH:
      delete waitingForMatch[socket.id];
      io.to(socket.id).emit("dispatch", [{ type: r.SET_USER_STATUS, value: { status: null, msg: "" } }]);

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
    match.players.forEach((player, i) => (player.turn = i ? false : true));
    matches[id] = { id, players: match };
    return {
      action: [
        { type: r.SET_MATCH, value: matches[id], players: matches[id].players },
        { type: r.SET_USER_STATUS, value: { status: "SETUP", msg: "Placing ships" }, players: matches[id].players },
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
//-------------------------------------------------SERVER START---------------------------------------------------------
server.listen(PORT, (err) => {
  if (!err) {
    console.log(chalk.green(`\nServer running on port : ${chalk.yellow(PORT)}`));
    serverStatus(io);
  } else {
    console.log(err);
  }
});
