import io from "socket.io-client";
import { r } from "../util/constants";

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
