import io from "socket.io-client";
import { r } from "../util/constants";

// export default function useSocketMan(dispatch) {
// function connectSocket({ user }) {
//   const socket = io("ws://localhost:5000", { query: user });

//   socket.on("findmatch", (match) => {
//     dispatch({ type: r.SET_MATCH, value: match });
//     dispatch({ type: r.SET_STATUS, value: "PLAYING" });
//   });

//   socket.on("cancelmatch", () => {
//     dispatch({ type: r.SET_STATUS, value: null });
//   });

//   socket.on("dispatch", (action) => {
//     action.forEach(({ type, value }) => dispatch({ type, value }));
//   });
//   dispatch({ type: r.SET_SOCKET, value: socket });
// }

export function socketConnect(dispatch, user) {
  const socket = io("ws://localhost:5000", { query: user });

  socket.on("dispatch", (action) => {
    action.forEach(({ type, value }) => dispatch({ type, value }));
  });

  dispatch({ type: r.SET_SOCKET, value: socket });
}

export function socketEmitter({ socket }, { type, value }) {
  socket.emit("dispatch", { type, value });
}

// function findPartner({ socket }) {
//   socket.emit("dispatch", { type: "FIND_MATCH", value: null });
// }

// function cancelMatch({ socket }) {
//   // socket.emit("cancelmatch");
//   socket.emit("dispatch", { type: "CANCEL_MATCH", value: null });
// }

// function quitMatch({ socket, match }) {
//   socket.emit("dispatch", { type: "FORFEIT_MATCH", value: match });
// }

// return { socketFunctions: { connectSocket, findPartner, cancelMatch, quitMatch } };
// }
