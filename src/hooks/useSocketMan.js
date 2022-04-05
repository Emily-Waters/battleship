import io from "socket.io-client";
import { r } from "../util/constants";

export function socketConnect(dispatch, user) {
  const socket = io("ws://localhost:5000", { query: user });

  socket.on("dispatch", (action) => {
    action.forEach(({ type, value }) => dispatch({ type, value }));
  });

  socket.on("disconnect", (reason) => {
    console.log(reason);
    dispatch({ type: r.SET_USER_STATUS, value: { status: null, msg: reason } });
  });

  dispatch({ type: r.SET_SOCKET, value: socket });
}

export function socketEmitter({ socket }, { type, value }) {
  socket.emit("dispatch", { type, value });
}
