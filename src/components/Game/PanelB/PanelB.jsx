import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../Game.scss";
import PlacementBoard from "./Placement/PlacementBoard/PlacementBoard";

export default function PanelB({ state, dispatch, userFunctions, gameFunctions, setDisplayUserMenu }) {
  const { setStatus, playGame } = userFunctions;

  function handleClick(opponent, status) {
    setStatus({ status: status });
    if (status === "PLAYING") {
      setDisplayUserMenu(false);
    }
    playGame(state);
  }

  return (
    <div className="panel--B">
      {!state.status && <div className="rules-container"></div>}

      {state.status === "SELECT" && (
        <div className="select-container">
          <h2 className="select-header">Who would you like to play against?</h2>
          <span className="select-btn-container">
            <button className="select-btn" onClick={() => handleClick("HUMAN", "LOADING")}>
              Human
            </button>
            <button className="select-btn" onClick={() => handleClick("COMPUTER", "PLAYING")}>
              Computer
            </button>
          </span>
        </div>
      )}

      {state.status === "LOADING" && (
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
    </div>
  );
}
