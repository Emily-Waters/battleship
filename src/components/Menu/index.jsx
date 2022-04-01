import GameMenu from "./GameMenu";
import "./Menu.scss";
import UserMenu from "./UserMenu";
export default function Menu({ state, logoutUser }) {
  return (
    <div className="menu-container">
      <UserMenu state={state} logoutUser={logoutUser} />
      <GameMenu />
    </div>
  );
}
