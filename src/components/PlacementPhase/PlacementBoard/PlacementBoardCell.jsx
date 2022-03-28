import React from "react";
import { useDrop } from "react-dnd";
import PlacementShip from "../PlacementShips/PlacementShip";
import Overlay from "./Overlay";

const shipTypes = ["BATTLESHIP", "CRUISER", "FRIGATE", "DESTROYER", "SCOUT"];

function PlacementBoardCell({ cellXY, currentShip, changeShipRotation, canMoveShip, moveShip, state }) {
  const isHead = currentShip && currentShip.XY[0] === cellXY[0] && currentShip.XY[1] === cellXY[1];
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: shipTypes,
      canDrop: (item) => canMoveShip(cellXY, item, state),
      drop: (item) => moveShip(cellXY, item, state),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [state.ships]
  );

  return (
    <div className={"board-cell"} ref={drop}>
      {isHead && <PlacementShip currentShip={currentShip} changeShipRotation={changeShipRotation} state={state} />}
      {isOver && <Overlay canDrop={canDrop} />}
      {currentShip && <div className="board-cell-hitmarker"></div>}
    </div>
  );
}

export default React.memo(PlacementBoardCell);
