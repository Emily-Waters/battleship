import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ShipBoard from "./Boards/ShipBoard/ShipBoard";
import "./Game.scss";

export default function PanelB({ state, gameFunctions }) {
  return (
    <div className="panel--B">
      {!state.user.status && <div className="rules-container">{state.user.msg}</div>}

      {state.user.status === "WAITING" && (
        <div className="loading-container">
          <div className="radar-container">
            <TrackChangesIcon className="radar" />
          </div>
          <span className="loading-status">{state.user.msg}</span>
        </div>
      )}

      {state.user.status === "READY" && (
        <div className="loading-container">
          <div className="radar-container">
            <TrackChangesIcon className="radar" />
          </div>
          <span className="loading-status">{state.user.msg}</span>
        </div>
      )}

      {state.user.status === "SETUP" && (
        <DndProvider backend={HTML5Backend}>
          <ShipBoard state={state} gameFunctions={gameFunctions} />
        </DndProvider>
      )}

      {state.user.status === "PLAYING" && (
        <DndProvider backend={HTML5Backend}>
          <ShipBoard state={state} gameFunctions={gameFunctions} />
        </DndProvider>
      )}

      {state.user.status === "DEBRIEF" && <div className="rules-container">{state.user.msg}</div>}
    </div>
  );
}
