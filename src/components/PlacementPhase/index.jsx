import PlacementBoard from "./PlacementBoard/PlacementBoard";
import PlacementSidebar from "./PlacementSidebar/PlacementSidebar";

export default function Placement({ state, changeShipRotation, canMoveShip, moveShip }) {
  return (
    <>
      <PlacementBoard
        state={state}
        changeShipRotation={changeShipRotation}
        canMoveShip={canMoveShip}
        moveShip={moveShip}
      />
      <PlacementSidebar />
    </>
  );
}
