import PlacementBoard from "./PlacementBoard/PlacementBoard";
import PlacementSidebar from "./PlacementSidebar/PlacementSidebar";

export default function Placement({ state, canRotateShip, rotateShip, canMoveShip, moveShip }) {
  return (
    <>
      <PlacementBoard
        state={state}
        canRotateShip={canRotateShip}
        rotateShip={rotateShip}
        canMoveShip={canMoveShip}
        moveShip={moveShip}
      />
      <PlacementSidebar />
    </>
  );
}
