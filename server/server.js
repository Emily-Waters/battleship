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

//-------------------------------------------------CONNECT USER---------------------------------------------------------
const users = {};

io.on("connection", (socket) => {
  users[socket.id] = { name: socket.handshake.query.name, id: socket.id, match: null };
  console.log(chalk.magenta("\nClient Connected"), users[socket.id]);
  //----------------------------------------------DISPATCH ACTIONS------------------------------------------------------
  socket.on("dispatch", (action) => {
    console.log(users[socket.id]);
    dispatch(socket, action);
  });
  //----------------------------------------------DISCONNECT USER-------------------------------------------------------
  socket.on("disconnect", (reason) => {
    console.log(users[socket.id], ` - disconnected - ${reason}`);
    delete users[socket.id];
  });
});
//------------------------------------------------DEFINE DISPATCH-------------------------------------------------------
function dispatch(socket, { type, value }) {
  console.log("Type   : ", type);

  switch (type) {
    case s.TARGET_CELL:
      targetCell(socket, value.XY);
      break;
    case s.READY:
      playerReady(socket, value);
      break;
    case s.FORFEIT_MATCH:
      forfeitMatch(socket);
      break;
    case s.FIND_MATCH:
      matchMaker(socket);
      break;
    case s.CANCEL_MATCH:
      cancelMatch(socket);
      break;
    default:
      break;
  }
  console.log("\nUser   : \n", users[socket.id]);
}
//-------------------------------------------------MATCH USERS----------------------------------------------------------

function getUserAndOpponent(id) {
  return { user: users[id].id, opponent: users[id].match.opponent };
}

function matchMaker(socket) {
  users[socket.id].match = { status: "WAITING" };
  const userPool = Object.values(users);

  const opponent = userPool.find((player) => {
    if (player.match && player.match.status === "WAITING" && player.id !== socket.id) {
      return player;
    }
  });

  if (opponent) {
    const match = [socket.id, opponent.id];
    match.forEach((id) => {
      users[id].match.status = "MATCHED";
      users[id].match.opponent = id === socket.id ? opponent.id : socket.id;
      io.to(id).emit("dispatch", [
        { type: r.SET_MATCH, value: users[id].match },
        { type: r.SET_USER_STATUS, value: { status: "SETUP", msg: "Placing ships" } },
      ]);
    });
  } else {
    io.to(socket.id).emit("dispatch", [
      { type: r.SET_USER_STATUS, value: { status: "WAITING", msg: "Finding Opponent" } },
    ]);
  }
}

function cancelMatch(socket) {
  users[socket.id].match = null;
  io.to(socket.id).emit("dispatch", [
    { type: r.SET_USER_STATUS, value: { status: "DEBRIEF", msg: "Cancelled matchmaking" } },
  ]);
}

function forfeitMatch(socket) {
  const { user, opponent } = getUserAndOpponent(socket.id);
  const match = [user, opponent];

  match.forEach((player) => {
    users[player].match = null;
    io.to(player).emit("dispatch", [
      {
        type: r.SET_USER_STATUS,
        value: {
          status: "DEBRIEF",
          msg: player === user ? "You Lost! You forfeited the match" : "You Won! Your opponent forfeited the match!",
        },
      },
      { type: r.SET_MATCH, value: null },
    ]);
  });
}

function playerReady(socket, { ships, board, targetBoard }) {
  users[socket.id].match = { ...users[socket.id].match, ships, board, targetBoard, status: "READY" };

  const { user, opponent } = getUserAndOpponent(socket.id);
  const match = [user, opponent];

  if (users[opponent].match.status === "READY") {
    match.forEach((player, index) => {
      const { ships, board, targetBoard } = users[player].match;
      users[player].match.status = "PLAYING";
      io.to(player).emit("dispatch", [
        { type: r.SET_BOARD, value: { ships, board } },
        { type: r.SET_TARGET_BOARD, value: targetBoard },
        {
          type: r.SET_USER_STATUS,
          value: {
            status: index ? "WAITING" : "PLAYING",
            msg: index ? `Waiting for ${users[users[player].match.opponent].name}'s turn` : "SHATTLEBIP!",
          },
        },
      ]);
    });
  } else {
    io.to(user).emit("dispatch", [
      { type: r.SET_USER_STATUS, value: { status: "WAITING", msg: `Waiting for ${users[opponent].name} to be ready` } },
    ]);
  }
}

function targetCell(socket, XY) {
  const [X, Y] = XY;

  const { user, opponent } = getUserAndOpponent(socket.id);
  const match = [user, opponent];
  let isHit = false;

  users[user].match.targetBoard[Y][X].isTarget = true;
  users[opponent].match.board[Y][X].isTarget = true;

  if (users[opponent].match.board[Y][X].isOccupied) {
    users[opponent].match.board[Y][X].isHit = true;
    users[user].match.targetBoard[Y][X].isHit = true;
    const shipName = users[opponent].match.board[Y][X].occupiedBy;
    users[opponent].match.ships.forEach((ship) => {
      if (ship.name === shipName) {
        ship.sections.forEach((section) => {
          if (section.XY[0] === X && section.XY[1] === Y) {
            section.isHit = true;
            isHit = true;
          }
        });
      }
    });
  }

  const playerHasWon = checkForWinner(opponent);

  match.forEach((player) => {
    const { ships, board, targetBoard } = users[player].match;
    if (playerHasWon) {
      io.to(player).emit("dispatch", [
        { type: r.SET_TARGET_BOARD, value: targetBoard },
        { type: r.SET_BOARD, value: { board, ships } },
        { type: r.SET_USER_STATUS, value: { status: "DEBRIEF", msg: user === player ? "You Won!" : "You Lost!" } },
        { type: r.SET_MATCH, value: null },
      ]);
    } else {
      io.to(player).emit("dispatch", [
        { type: r.SET_TARGET_BOARD, value: targetBoard },
        { type: r.SET_BOARD, value: { board, ships } },
        {
          type: r.SET_USER_STATUS,
          value: {
            status: user === player ? "WAITING" : "PLAYING",
            msg: `${isHit ? "Hit" : "Miss"}! Waiting for ${users[users[player].match.opponent].name}'s turn`,
          },
        },
      ]);
    }
  });
}

function checkForWinner(opponent) {
  let hasPlayerWon = true;
  users[opponent].match.ships.forEach((ship) => {
    ship.sections.forEach((section) => {
      if (!section.isHit) {
        hasPlayerWon = false;
      }
    });
  });
  return hasPlayerWon;
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
