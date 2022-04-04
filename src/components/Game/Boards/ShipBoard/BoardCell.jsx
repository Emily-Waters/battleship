import React from "react";
import { useDrop } from "react-dnd";
import PlacementShip from "../../Ships/PlacementShips/PlacementShip";
import Overlay from "./Overlay";

const shipTypes = ["BATTLESHIP", "CRUISER", "FRIGATE", "DESTROYER", "SCOUT"];

function BoardCell({ cellXY, ship, state, gameFunctions }) {
  const { canMoveShip, canRotateShip, moveShip, rotateShip } = gameFunctions;
  const isHead = ship && ship.XY[0] === cellXY[0] && ship.XY[1] === cellXY[1];
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: shipTypes,
      canDrop: ({ ship }) => canMoveShip(cellXY, ship, state),
      drop: ({ ship }) => moveShip(cellXY, ship, state),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [state.ships]
  );

  return (
    <div className={"board-cell"} ref={state.user.status === "SETUP" ? drop : null}>
      {isHead && <PlacementShip ship={ship} canRotateShip={canRotateShip} rotateShip={rotateShip} state={state} />}
      {isOver && <Overlay canDrop={canDrop} />}
    </div>
  );
}

export default React.memo(BoardCell);
