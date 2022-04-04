import axios from "axios";
import { r } from "../util/constants";
import { socketConnect } from "./useSocketMan";
import useStateManager from "./useStateManager";

export default function useApplicationData() {
  const { state, dispatch, initializedShips } = useStateManager();

  //---------------------------------------------INITIALIZE GAMEBOARD---------------------------------------------------
  function updateBoard({ ships }) {
    const updatedShips = ships.map((ship) => {
      return mapShipSections(ship);
    });
    const board = setCellStatus({ ships: updatedShips });
    dispatch({ type: r.SET_BOARD, value: { ships: updatedShips, board } });
  }

  //-----------------------------------------------MANAGE GAMEBOARD-----------------------------------------------------

  function reset() {
    updateBoard({ ships: initializedShips });
    generateTargetBoard();
  }

  function generateBoard() {
    const boardSize = 10;
    const rowTemplate = Array.from(Array(boardSize));

    return rowTemplate.map((_, y) => {
      return rowTemplate.map((_, x) => {
        return { id: y * 10 + x, XY: [x, y], isOccupied: false, occupiedBy: null };
      });
    });
  }

  function generateTargetBoard() {
    const boardSize = 10;
    const rowTemplate = Array.from(Array(boardSize));

    const targetBoard = rowTemplate.map((_, y) => {
      return rowTemplate.map((_, x) => {
        return { id: y * 10 + x, XY: [x, y], isTarget: false, isHit: false };
      });
    });

    dispatch({ type: r.SET_TARGET_BOARD, value: targetBoard });
  }

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
  //-------------------------------------------------MANAGE SHIPS-------------------------------------------------------
  function mapShipSections(ship) {
    return {
      ...ship,
      sections: ship.sections.map((section, i) => {
        return { ...section, XY: ship.isVertical ? [ship.XY[0], ship.XY[1] + i] : [ship.XY[0] + i, ship.XY[1]] };
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

  function rotateShip(ship, { ships }) {
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

  function moveShip(cellXY, ship, { ships }) {
    const [...updatedShips] = ships;

    updatedShips.find(({ name }) => name === ship.name).XY = cellXY;

    updateBoard({ ships: updatedShips });
  }
  //-----------------------------------------------------LOGIN----------------------------------------------------------
  async function validateUser(email, password) {
    const {
      data: { type, value },
    } = await axios.post("api/users/login", { email, password });
    // console.log(value);
    dispatch({ type, value });
    socketConnect(dispatch, value);
  }

  async function registerUser(email, username, password) {
    const {
      data: { type, value },
    } = await axios.post("api/users/register", { email, username, password });
    dispatch({ type, value });
    socketConnect(dispatch, value);
  }

  function logoutUser({ socket }) {
    if (socket && socket.connected) {
      socket.disconnect();
    }
    dispatch({ type: r.SET_USER, value: null });
    dispatch({ type: r.SET_SOCKET, value: null });
  }

  function clearErrors() {
    dispatch({ type: r.SET_ERROR, value: "" });
  }
  //------------------------------------------------------MENU----------------------------------------------------------
  function setStatusStyle({ status }) {
    switch (status) {
      case "WAITING":
        return "yellow";
      case "SETUP":
        return "orange";
      case "READY":
        return "orange";
      case "PLAYING":
        return "red";
      case "DEBRIEF":
        return "cyan";
      default:
        return "green";
    }
  }

  function setUserStatus({ status, msg }) {
    dispatch({ type: r.SET_USER_STATUS, value: { status, msg } });
  }
  //------------------------------------------------------GAME----------------------------------------------------------

  //-----------------------------------------------------RETURN---------------------------------------------------------
  return {
    state,
    dispatch,
    gameFunctions: { canRotateShip, rotateShip, canMoveShip, moveShip },
    userFunctions: {
      validateUser,
      registerUser,
      clearErrors,
      setUserStatus,
      setStatusStyle,
      logoutUser,
      reset,
    },
  };
}
