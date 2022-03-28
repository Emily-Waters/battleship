import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import useApplicationData from "../hooks/useApplicationData";
import "./Application.scss";
import Placement from "./PlacementPhase";

export default function App() {
  const { state, changeShipRotation, canMoveShip, moveShip } = useApplicationData();
  console.log(state);
  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <Placement
          state={state}
          changeShipRotation={changeShipRotation}
          canMoveShip={canMoveShip}
          moveShip={moveShip}
        />
      </DndProvider>
    </div>
  );
}
