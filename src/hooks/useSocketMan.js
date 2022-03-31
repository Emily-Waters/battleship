import { useEffect } from "react";
import io from "socket.io-client";
import { r } from "../util/constants";

export default function useSocketMan(state, dispatch) {
  useEffect(() => {
    if (state.user) {
      const socket = io("ws://localhost:5000", { query: state.user });

      socket.on("connect", () => {
        console.log("Socket Connected: ", socket.id);
      });

      socket.on("user", (userPool) => {
        dispatch({ type: r.SET_USER_POOL, value: userPool });
        console.log(userPool);
      });

      return () => {
        if (socket.connected) socket.close();
      };
    }
  }, [state.user]);
}
