import { useEffect } from "react";
import io from "socket.io-client";

export default function useSocketMan() {
  useEffect(() => {
    const socket = io("ws://localhost:5000");

    socket.on("connect", () => {
      console.log("Socket Connected: ", socket.id);
    });

    return () => {
      if (socket.connected) socket.close();
    };
  }, []);
}
