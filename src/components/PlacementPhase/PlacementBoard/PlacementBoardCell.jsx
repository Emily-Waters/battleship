import React from "react";
import { useDrop } from "react-dnd";
import PlacementShip from "../PlacementShips/PlacementShip";
import Overlay from "./Overlay";

const shipTypes = ["BATTLESHIP", "CRUISER", "FRIGATE", "DESTROYER", "SCOUT"];

function PlacementBoardCell({
  cellXY,
  shipItem,
  changeShipRotation,
  canMoveShip,
  moveShip,
  shipState,
  gameBoardState,
}) {
  const isHead = shipItem && shipItem.XY[0] === cellXY[0] && shipItem.XY[1] === cellXY[1];
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: shipTypes,
      canDrop: (item) => canMoveShip(cellXY, item, gameBoardState),
      drop: (item) => moveShip(cellXY, item, shipState, gameBoardState),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [shipState]
  );

  return (
    <div className={"board-cell"} ref={drop}>
      {isHead && (
        <PlacementShip
          shipItem={shipItem}
          changeShipRotation={changeShipRotation}
          shipState={shipState}
          gameBoardState={gameBoardState}
        />
      )}
      {isOver && <Overlay canDrop={canDrop} />}
      {shipItem && <div className="board-cell-hitmarker"></div>}
    </div>
  );
}

export default React.memo(PlacementBoardCell);
