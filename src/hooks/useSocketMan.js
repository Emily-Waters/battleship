import io from "socket.io-client";
import { r } from "../util/constants";

export default function useSocketMan(dispatch) {
  function connectSocket({ user }) {
    const socket = io("ws://localhost:5000", { query: user });

    socket.on("findmatch", (match) => {
      dispatch({ type: r.SET_MATCH, value: match });
      dispatch({ type: r.SET_STATUS, value: "PLAYING" });
    });

    socket.on("cancelmatch", () => {
      dispatch({ type: r.SET_STATUS, value: null });
    });

    socket.on("dispatch", (action) => {
      action.forEach(({ type, value }) => dispatch({ type, value }));
      // dispatch({ type, value });
    });
    return socket;
  }

  function findPartner({ socket }) {
    socket.emit("dispatch", { type: "FIND_MATCH", value: null });
  }

  function cancelMatch({ socket }) {
    // socket.emit("cancelmatch");
    socket.emit("dispatch", { type: "CANCEL_MATCH", value: null });
  }

  function quitMatch({ socket, match }) {
    socket.emit("forfeit", { match });
  }

  return { socketFunctions: { connectSocket, findPartner, cancelMatch, quitMatch } };
}
