import { socketEmitter } from "../../../hooks/useSocketMan";
import "./Menu.scss";
export default function MenuButton({ state, statusStyle, userFunctions }) {
  const { setUserStatus, reset } = userFunctions;
  return (
    <button
      className="user-options-btn"
      style={{ color: statusStyle, borderColor: statusStyle }}
      onClick={() => {
        !state.user.status && socketEmitter(state, { type: "FIND_MATCH", value: null });
        !state.user.status && reset();
        state.user.status === "WAITING" && socketEmitter(state, { type: "CANCEL_MATCH", value: null });
        state.user.status === "SETUP" &&
          socketEmitter(state, {
            type: "READY",
            value: { match: state.match, board: state.board, ships: state.ships, targetBoard: state.targetBoard },
          });
        state.user.status === "READY" && socketEmitter(state, { type: "FORFEIT_MATCH", value: state.match });
        state.user.status === "PLAYING" && socketEmitter(state, { type: "FORFEIT_MATCH", value: state.match });
        state.user.status === "DEBRIEF" && setUserStatus({ status: null, msg: "" });
      }}
    >
      {!state.user.status && "Play"}
      {state.user.status === "WAITING" && "Cancel"}
      {state.user.status === "SETUP" && "Ready"}
      {state.user.status === "READY" && "Forfeit"}
      {state.user.status === "PLAYING" && "Forfeit"}
      {state.user.status === "DEBRIEF" && "Back"}
    </button>
  );
}
