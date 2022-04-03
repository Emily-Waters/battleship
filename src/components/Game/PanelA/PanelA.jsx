import "../Game.scss";
import UserMenu from "./Menu/UserMenu";

export default function PanelA({
  state,
  userFunctions,
  gameFunctions,
  logoutUser,
  displayUserMenu,
  setDisplayUserMenu,
}) {
  return (
    <div className="panel--A">
      <UserMenu state={state} logoutUser={logoutUser} userFunctions={userFunctions} displayUserMenu={displayUserMenu} />

      {state.status === "PLAYING" && "target board"}
    </div>
  );
}
