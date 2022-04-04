import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../Game.scss";
import PlacementBoard from "./Placement/PlacementBoard/PlacementBoard";

export default function PanelB({ state, gameFunctions }) {
  return (
    <div className="panel--B">
      {!state.status && <div className="rules-container">RULES</div>}

      {state.status === "WAITING" && (
        <div className="loading-container">
          <div className="radar-container">
            <TrackChangesIcon className="radar" />
          </div>
          <span className="loading-status">Finding An Opponent</span>
        </div>
      )}

      {state.status === "PLAYING" && (
        <DndProvider backend={HTML5Backend}>
          <PlacementBoard state={state} gameFunctions={gameFunctions} />;
        </DndProvider>
      )}
      {state.status === "DEBRIEF" && (
        <div className="rules-container">{state.lastMatch.winner ? "You Won!" : "You Lost"}</div>
      )}
    </div>
  );
}
