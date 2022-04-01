export default function UserMenu({ state, logoutUser }) {
  return (
    <div className="menu-board">
      <div className="user-menu">
        <h2 className="user-title">
          <div className="user-name">{state.user.name}</div>:
          <div className="user-status" style={{ color: "green" }}>
            In Menu
          </div>
        </h2>
        <button className="logout-btn" onClick={logoutUser}>
          Logout
        </button>
      </div>
    </div>
  );
}
