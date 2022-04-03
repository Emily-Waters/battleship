import io from "socket.io-client";
import { r } from "../util/constants";

export default function useSocketMan(dispatch) {
  function connectSocket({ user }) {
    console.log("CONNECT SOCKET - ", user);
    const socket = io("ws://localhost:5000", { query: user });

    socket.on("user", (user) => {
      console.log(user);
    });

    socket.on("findmatch", (match) => {
      dispatch({ type: r.SET_MATCH, value: match });
      dispatch({ type: r.SET_STATUS, value: "PLAYING" });
    });
    return socket;
  }

  function findPartner({ socket }) {
    socket.emit("findmatch");
  }

  function cancelMatch({ socket }) {
    socket.emit("cancelmatch");
  }

  return { socketFunctions: { connectSocket, findPartner, cancelMatch } };
}
