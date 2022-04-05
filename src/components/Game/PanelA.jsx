import TargetBoard from "./Boards/TargetBoard/TargetBoard";
import "./Game.scss";
import UserMenu from "./Menu/UserMenu";

export default function PanelA({
  state,
  userFunctions,
  gameFunctions,
  logoutUser,
  displayUserMenu,
  setDisplayUserMenu,
  socketEmitter,
}) {
  return (
    <div className="panel--A">
      <UserMenu state={state} logoutUser={logoutUser} userFunctions={userFunctions} displayUserMenu={displayUserMenu} />

      {state.user.status === "PLAYING" && <TargetBoard state={state} socketEmitter={socketEmitter} />}
    </div>
  );
}
