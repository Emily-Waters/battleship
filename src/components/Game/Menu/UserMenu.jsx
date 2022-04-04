import "./Menu.scss";
import MenuButton from "./MenuButton";

export default function UserMenu({ state, logoutUser, userFunctions, displayUserMenu }) {
  const { setStatusStyle } = userFunctions;
  const statusStyle = setStatusStyle(state.user);
  const userMenuStyle = displayUserMenu ? "user-menu" : "user-menu--in";
  return (
    <div className={userMenuStyle}>
      <span className="user-header">
        <div className="user-name">{state.user.name}</div>
        <div className="user-status" style={{ color: statusStyle }}>
          {state.user.status || "MENU"}
        </div>
      </span>

      <section className="user-menu-container">
        <section className="user-stats">STATS</section>
      </section>

      <span className="game-options">
        <button className="user-options-btn" style={{ color: "red", borderColor: "red" }} onClick={logoutUser}>
          Logout
        </button>
        <MenuButton state={state} userFunctions={userFunctions} statusStyle={statusStyle} />
      </span>
    </div>
  );
}
