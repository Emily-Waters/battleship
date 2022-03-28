import PlacementBoard from "./PlacementBoard/PlacementBoard";
import PlacementSidebar from "./PlacementSidebar/PlacementSidebar";

export default function Placement({ gameBoardState, shipState, changeShipRotation, canMoveShip, moveShip }) {
  return (
    <>
      <PlacementBoard
        gameBoardState={gameBoardState}
        shipState={shipState}
        changeShipRotation={changeShipRotation}
        canMoveShip={canMoveShip}
        moveShip={moveShip}
      />
      <PlacementSidebar />
    </>
  );
}
