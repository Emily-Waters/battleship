import PlacementBoard from "./PlacementBoard/PlacementBoard";
import "./PlacementBoard/PlacementPhase.scss";

export default function Placement({ state, shipFunctions }) {
  return (
    <div className="placement-container">
      <PlacementBoard state={state} shipFunctions={shipFunctions} />;
      <PlacementBoard state={state} shipFunctions={shipFunctions} />;
    </div>
  );
}
