import PlacementBoard from "./PlacementBoard/PlacementBoard";

export default function Placement({ state, shipFunctions }) {
  return <PlacementBoard state={state} shipFunctions={shipFunctions} />;
}
