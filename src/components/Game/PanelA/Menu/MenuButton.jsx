import { socketEmitter } from "../../../../hooks/useSocketMan";
import "./Menu.scss";
export default function MenuButton({ state, statusStyle, userFunctions }) {
  const { setStatus } = userFunctions;
  return (
    <button
      className="user-options-btn"
      style={{ color: statusStyle, borderColor: statusStyle }}
      onClick={() => {
        !state.status && socketEmitter(state, { type: "FIND_MATCH", value: null });
        state.status === "WAITING" && socketEmitter(state, { type: "CANCEL_MATCH", value: null });
        state.status === "PLAYING" && socketEmitter(state, { type: "FORFEIT_MATCH", value: state.match });
        state.status === "DEBRIEF" && setStatus({ status: null });
      }}
    >
      {!state.status && "Play"}
      {state.status === "WAITING" && "Cancel"}
      {state.status === "PLAYING" && "Forfeit"}
      {state.status === "DEBRIEF" && "Back"}
    </button>
  );
}
