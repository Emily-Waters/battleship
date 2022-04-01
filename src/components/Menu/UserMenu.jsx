import "./Menu.scss";
import MenuButton from "./MenuButton";

export default function UserMenu({ state, logoutUser, menuFunctions, displayUserMenu }) {
  const { setStatusStyle } = menuFunctions;
  const statusStyle = setStatusStyle(state);
  const userMenuStyle = displayUserMenu ? "user-menu" : "user-menu--in";
  return (
    <div className={userMenuStyle}>
      <span className="user-header">
        <div className="user-name">{state.user.name}</div>
        <div className="user-status" style={{ color: statusStyle }}>
          {state.status || "MENU"}
        </div>
      </span>

      <section className="user-menu-container">
        <section className="user-stats">STATS</section>
      </section>

      <span className="game-options">
        <button className="user-options-btn" style={{ color: "red", borderColor: "red" }} onClick={logoutUser}>
          Logout
        </button>
        <MenuButton state={state} menuFunctions={menuFunctions} statusStyle={statusStyle} />
      </span>
    </div>
  );
}
