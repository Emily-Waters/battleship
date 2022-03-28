import { useEffect } from "react";
import useStateManager from "./useStateManager";
export default function useApplicationData() {
  const { state, dispatch, r } = useStateManager();

  function updateBoard({ ships, board }) {
    console.log("UPDATE BOARD");
    const updatedShips = ships.map((ship) => {
      return {
        ...ship,
        sections: Array.from(Array(ship.size)).map((_, i) => {
          return ship.isVertical
            ? { id: i, XY: [ship.XY[0], ship.XY[1] + i] }
            : { id: i, XY: [ship.XY[0] + i, ship.XY[1]] };
        }),
      };
    });
    const updatedBoard = setCellStatus({ ships: updatedShips, board });
    console.log(updatedShips);
    dispatch({ type: r.UPDATE_BOARD, value: { ships: updatedShips, board: updatedBoard } });
  }

  useEffect(() => {
    updateBoard(state);
  }, []);

  function setCellStatus({ ships, board }) {
    const [...boardCopy] = board;
    boardCopy.forEach((row) => {
      row.forEach((cell) => {
        cell.isOccupied = false;
        cell.occupiedBy = null;
      });
    });
    ships.forEach((ship) => {
      ship.sections.forEach((section) => {
        boardCopy[section.XY[1]][section.XY[0]].isOccupied = true;
        boardCopy[section.XY[1]][section.XY[0]].occupiedBy = ship.name;
      });
    });

    return boardCopy;
  }

  function canRotateShip(currentShip, { board }) {
    const isInBounds = currentShip.isVertical
      ? currentShip.XY[0] + currentShip.size <= 10
      : currentShip.XY[1] + currentShip.size <= 10;
    let isCollision = false;

    currentShip.sections.forEach((section, index) => {
      if (currentShip.isVertical) {
        if (board[currentShip.XY[1]][currentShip.XY[0] + index].isOccupied) {
          if (board[currentShip.XY[1]][currentShip.XY[0] + index].occupiedBy !== currentShip.name) {
            isCollision = true;
          }
        }
      }
      if (!currentShip.isVertical) {
        if (board[currentShip.XY[1] + index][currentShip.XY[0]].isOccupied) {
          if (board[currentShip.XY[1] + index][currentShip.XY[0]].occupiedBy !== currentShip.name) {
            isCollision = true;
          }
        }
      }
    });
    return isInBounds && !isCollision;
  }

  function changeShipRotation(currentShip, { ships, board }) {
    if (canRotateShip(currentShip, board)) {
      const [...shipCopy] = ships;
      shipCopy.find((ship) => ship.name === currentShip.name).isVertical = !currentShip.isVertical;
      updateBoard({ ships: shipCopy, board });
    }
  }

  function canMoveShip(XY, currentShip, { board }) {
    const isInBounds = currentShip.isVertical ? XY[1] + currentShip.size <= 10 : XY[0] + currentShip.size <= 10;
    let isCollision = false;
    if (isInBounds) {
      const updatedShipItem = {
        ...currentShip,
        XY: XY,
        isVertical: currentShip.isVertical,
        sections: Array.from(Array(currentShip.size)).map((_, index) => {
          return currentShip.isVertical
            ? { id: index, XY: [XY[0], XY[1] + index] }
            : { id: index, XY: [XY[0] + index, XY[1]] };
        }),
      };
      updatedShipItem.sections.forEach((section, index) => {
        if (board[section.XY[1]][section.XY[0]].isOccupied) {
          isCollision = board[section.XY[1]][section.XY[0]].occupiedBy !== currentShip.name;
        }
      });
    }
    return isInBounds && !isCollision;
  }

  function moveShip(XY, currentShip, { ships, board }) {
    const [...shipsCopy] = ships;
    const updatedShips = shipsCopy.map((ship) => {
      return ship.name === currentShip.name
        ? {
            ...ship,
            isVertical: currentShip.isVertical,
            XY: XY,
            sections: Array.from(Array(ship.size)).map((_, index) => {
              return currentShip.isVertical
                ? { id: index, XY: [XY[0], XY[1] + index] }
                : { id: index, XY: [XY[0] + index, XY[1]] };
            }),
          }
        : { ...ship };
    });

    updateBoard({ ships: updatedShips, board });
  }

  return { state, changeShipRotation, canMoveShip, moveShip };
}
