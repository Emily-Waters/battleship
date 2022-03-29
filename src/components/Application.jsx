import axios from "axios";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import useApplicationData from "../hooks/useApplicationData";
import "./Application.scss";
import Placement from "./PlacementPhase";

export default function App() {
  const { state, canRotateShip, rotateShip, canMoveShip, moveShip } = useApplicationData();
  axios.get("http://localhost:5000/");
  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <Placement
          state={state}
          canRotateShip={canRotateShip}
          rotateShip={rotateShip}
          canMoveShip={canMoveShip}
          moveShip={moveShip}
        />
      </DndProvider>
    </div>
  );
}
