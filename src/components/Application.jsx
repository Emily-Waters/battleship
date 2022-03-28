import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import useApplicationData from "../hooks/useApplicationData";
import "./Application.scss";
import Placement from "./PlacementPhase";

export default function App() {
  const { state, changeShipRotation, canMoveShip, moveShip } = useApplicationData();
  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <Placement
          gameBoardState={state.placementBoard}
          shipState={state.ships}
          changeShipRotation={changeShipRotation}
          canMoveShip={canMoveShip}
          moveShip={moveShip}
        />
      </DndProvider>
    </div>
  );
}
