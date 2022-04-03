import "./Menu.scss";

export default function MenuButton({ state, statusStyle, userFunctions }) {
  const { setStatus, cancelFindMatch, forfeitMatch } = userFunctions;
  return (
    <button
      className="user-options-btn"
      style={{ color: statusStyle, borderColor: statusStyle }}
      onClick={() => {
        !state.status && setStatus({ status: "SELECT" });
        state.status === "SELECT" && setStatus({ status: null });
        state.status === "LOADING" && cancelFindMatch(state);
        state.status === "PLAYING" && forfeitMatch(state);
      }}
    >
      {!state.status && "Play"}
      {state.status === "SELECT" && "Cancel"}
      {state.status === "LOADING" && "Cancel"}
      {state.status === "PLAYING" && "Forfeit"}
    </button>
  );
}
