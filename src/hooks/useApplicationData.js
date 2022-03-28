import { useEffect } from "react";
import useStateManager from "./useStateManager";
export default function useApplicationData() {
  const { state, dispatch, r } = useStateManager();

  function generateBoard() {
    const boardSize = 10;
    const rowTemplate = Array.from(Array(boardSize));

    return rowTemplate.map((_, y) => {
      return rowTemplate.map((_, x) => {
        return { id: y * 10 + x, XY: [x, y], isOccupied: false, occupiedBy: null };
      });
    });
  }

  function updateBoard({ ships }) {
    const updatedShips = ships.map((ship) => {
      return mapShipSections(ship);
    });
    const board = setCellStatus({ ships: updatedShips });
    dispatch({ type: r.UPDATE_BOARD, value: { ships: updatedShips, board } });
  }

  useEffect(() => {
    updateBoard(state);
  }, []);

  function setCellStatus({ ships }) {
    const board = generateBoard();

    ships.forEach((ship) => {
      ship.sections.forEach((section) => {
        board[section.XY[1]][section.XY[0]].isOccupied = true;
        board[section.XY[1]][section.XY[0]].occupiedBy = ship.name;
      });
    });

    return board;
  }

  function mapShipSections(currentShip) {
    return {
      ...currentShip,
      sections: Array.from(Array(currentShip.size)).map((_, i) => {
        return currentShip.isVertical
          ? { id: i, XY: [currentShip.XY[0], currentShip.XY[1] + i] }
          : { id: i, XY: [currentShip.XY[0] + i, currentShip.XY[1]] };
      }),
    };
  }

  function checkInBounds({ XY, isVertical, size }) {
    return isVertical ? XY[1] + size <= 10 : XY[0] + size <= 10;
  }

  function checkCollision(currentShip, board) {
    let isCollision = false;

    currentShip.sections.forEach((section, index) => {
      if (board[section.XY[1]][section.XY[0]].isOccupied) {
        isCollision = board[section.XY[1]][section.XY[0]].occupiedBy !== currentShip.name;
      }
    });

    return isCollision;
  }

  function canRotateShip(ship, { board }) {
    const { ...shipCopy } = ship;

    shipCopy.isVertical = !ship.isVertical;

    const updatedShip = mapShipSections(shipCopy);
    const isInBounds = checkInBounds(updatedShip);
    const isCollision = isInBounds && checkCollision(updatedShip, board);

    return isInBounds && !isCollision;
  }

  function rotateShip(ship, { ships, board }) {
    const [...updatedShips] = ships;

    updatedShips.find(({ name }) => name === ship.name).isVertical = !ship.isVertical;

    updateBoard({ ships: updatedShips });
  }

  function canMoveShip(cellXY, ship, { board }) {
    const { ...shipCopy } = ship;

    shipCopy.XY = cellXY;

    const updatedShip = mapShipSections(shipCopy);
    const isInBounds = checkInBounds(updatedShip);
    const isCollision = isInBounds && checkCollision(updatedShip, board);

    return isInBounds && !isCollision;
  }

  function moveShip(cellXY, ship, { ships, board }) {
    const [...updatedShips] = ships;

    updatedShips.find(({ name }) => name === ship.name).XY = cellXY;

    updateBoard({ ships: updatedShips });
  }

  return { state, canRotateShip, rotateShip, canMoveShip, moveShip };
}
