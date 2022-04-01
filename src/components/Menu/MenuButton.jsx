import "./Menu.scss";

export default function MenuButton({ state, statusStyle, menuFunctions }) {
  const { setStatus } = menuFunctions;
  return (
    <button
      className="user-options-btn"
      style={{ color: statusStyle, borderColor: statusStyle }}
      onClick={() => {
        state.status ? setStatus({ status: null }) : setStatus({ status: "SELECT" });
      }}
    >
      {!state.status && "Play"}
      {state.status === "SELECT" && "Cancel"}
      {state.status === "LOADING" && "Cancel"}
      {state.status === "PLAYING" && "Forfeit"}
    </button>
  );
}
