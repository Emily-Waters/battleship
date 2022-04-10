import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../Application.scss";
import ShipBoard from "./Boards/ShipBoard/ShipBoard";
import TargetBoard from "./Boards/TargetBoard/TargetBoard";
import "./Game.scss";

export default function Game({ state, gameFunctions, socketEmitter }) {
  return (
    <>
      <div className="panel">
        <TargetBoard state={state} socketEmitter={socketEmitter} />
      </div>
      <div className="panel">
        {(state.user.status === "SETUP" || state.user.status === "PLAYING" || state.user.status === "WAITING") && (
          <DndProvider backend={HTML5Backend}>
            <ShipBoard state={state} gameFunctions={gameFunctions} />
          </DndProvider>
        )}
      </div>
      {state.user && (state.user.status === "WAITING" || !state.user.status || state.user.status === "DEBRIEF") && (
        <div className="waiting-overlay">{state.user.msg}</div>
      )}
    </>
  );
}
