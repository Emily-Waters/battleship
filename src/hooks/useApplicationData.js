import { useEffect } from "react";
import useStateManager from "./useStateManager";
export default function useApplicationData() {
  const { state, dispatch, r } = useStateManager();

  function initializeState() {
    const initialShipState = [
      { name: "BATTLESHIP", XY: [7, 2], isVertical: true, size: 5 },
      { name: "CRUISER", XY: [1, 2], isVertical: true, size: 4 },
      { name: "FRIGATE", XY: [2, 2], isVertical: true, size: 4 },
      { name: "DESTROYER", XY: [3, 2], isVertical: true, size: 3 },
      { name: "SCOUT", XY: [4, 2], isVertical: true, size: 2 },
    ];

    const initialShipStateWithRange = initialShipState.map((ship) => {
      return {
        ...ship,
        sections: Array.from(Array(ship.size)).map((_, index) => {
          return ship.isVertical
            ? { id: index, XY: [ship.XY[0], ship.XY[1] + index] }
            : { id: index, XY: [ship.XY[0] + index, ship.XY[1]] };
        }),
      };
    });

    const boardSize = 10;
    const rowTemplate = Array.from(Array(boardSize));

    const initialGameBoardState = rowTemplate.map((_, y) => {
      return rowTemplate.map((_, x) => {
        return { id: y * 10 + x, XY: [x, y], isOccupied: false, occupiedBy: null };
      });
    });

    // initialShipStateWithRange.forEach((ship) => {
    //   ship.sections.forEach((section) => {
    //     initialGameBoardState[section.XY[0]][section.XY[1]].isOccupied = true;
    //   });
    // });
    const updatedGameBoard = setOccupiedCells(initialShipStateWithRange, initialGameBoardState);
    console.log(initialGameBoardState);

    dispatch({
      type: r.SET_PLACEMENT_BOARD,
      value: {
        ships: initialShipStateWithRange,
        placementBoard: initialGameBoardState,
      },
    });
  }

  useEffect(() => {
    initializeState();
  }, []);

  function setOccupiedCells(shipState, gameBoardState) {
    const [...gameBoardStateCopy] = gameBoardState;
    gameBoardStateCopy.forEach((row) => {
      row.forEach((cell) => {
        cell.isOccupied = false;
        cell.occupiedBy = null;
      });
    });
    shipState.forEach((ship) => {
      ship.sections.forEach((section) => {
        gameBoardStateCopy[section.XY[1]][section.XY[0]].isOccupied = true;
        gameBoardStateCopy[section.XY[1]][section.XY[0]].occupiedBy = ship.name;
      });
    });

    return gameBoardStateCopy;
  }

  function canRotateShip(shipItem, gameBoardState) {
    const isInBounds = shipItem.isVertical
      ? shipItem.XY[0] + shipItem.size <= 10
      : shipItem.XY[1] + shipItem.size <= 10;
    let isCollision = false;

    shipItem.sections.forEach((section, index) => {
      if (shipItem.isVertical) {
        if (gameBoardState[shipItem.XY[1]][shipItem.XY[0] + index].isOccupied) {
          if (gameBoardState[shipItem.XY[1]][shipItem.XY[0] + index].occupiedBy !== shipItem.name) {
            isCollision = true;
          }
        }
      }
      if (!shipItem.isVertical) {
        if (gameBoardState[shipItem.XY[1] + index][shipItem.XY[0]].isOccupied) {
          if (gameBoardState[shipItem.XY[1] + index][shipItem.XY[0]].occupiedBy !== shipItem.name) {
            isCollision = true;
          }
        }
      }
    });
    return isInBounds && !isCollision;
  }

  function changeShipRotation(shipItem, shipState, gameBoardState) {
    if (canRotateShip(shipItem, gameBoardState)) {
      const [...shipStateCopy] = shipState;
      const updatedShipState = shipStateCopy.map((ship) => {
        return ship.name === shipItem.name
          ? {
              ...ship,
              isVertical: !ship.isVertical,
              sections: Array.from(Array(ship.size)).map((_, index) => {
                return ship.isVertical
                  ? { id: index, XY: [ship.XY[0] + index, ship.XY[1]] }
                  : { id: index, XY: [ship.XY[0], ship.XY[1] + index] };
              }),
            }
          : { ...ship };
      });

      dispatch({ type: r.UPDATE_SHIPS, value: updatedShipState });
    }
  }

  function canMoveShip(XY, shipItem, gameBoardState) {
    const isInBounds = shipItem.isVertical ? XY[1] + shipItem.size <= 10 : XY[0] + shipItem.size <= 10;
    let isCollision = false;
    if (isInBounds) {
      const { ...shipItemCopy } = shipItem;
      const updatedShipItem = {
        ...shipItemCopy,
        XY: XY,
        isVertical: shipItemCopy.isVertical,
        sections: Array.from(Array(shipItemCopy.size)).map((_, index) => {
          return shipItemCopy.isVertical
            ? { id: index, XY: [XY[0], XY[1] + index] }
            : { id: index, XY: [XY[0] + index, XY[1]] };
        }),
      };
      updatedShipItem.sections.forEach((section, index) => {
        if (gameBoardState[section.XY[1]][section.XY[0]].isOccupied) {
          isCollision = gameBoardState[section.XY[1]][section.XY[0]].occupiedBy !== shipItemCopy.name;
        }
      });
    }
    return isInBounds && !isCollision;
  }

  function moveShip(XY, shipItem, shipState, gameBoardState) {
    const [...shipStateCopy] = shipState;
    const updatedShipState = shipStateCopy.map((ship) => {
      return ship.name === shipItem.name
        ? {
            ...ship,
            isVertical: shipItem.isVertical,
            XY: XY,
            sections: Array.from(Array(ship.size)).map((_, index) => {
              return shipItem.isVertical
                ? { id: index, XY: [XY[0], XY[1] + index] }
                : { id: index, XY: [XY[0] + index, XY[1]] };
            }),
          }
        : { ...ship };
    });

    const updatedGameBoard = setOccupiedCells(updatedShipState, gameBoardState);

    dispatch({ type: r.UPDATE_SHIPS, value: updatedShipState });

    dispatch({ type: r.UPDATE_GAME_BOARD, value: updatedGameBoard });
  }

  return { state, changeShipRotation, canMoveShip, moveShip };
}
