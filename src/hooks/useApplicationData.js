import axios from "axios";
import { useEffect } from "react";
import { r } from "../util/constants";
import useSocketMan from "./useSocketMan";
import useStateManager from "./useStateManager";

export default function useApplicationData() {
  const { state, dispatch, initializedShips } = useStateManager();
  const { socketFunctions } = useSocketMan(dispatch);
  //---------------------------------------------INITIALIZE GAMEBOARD---------------------------------------------------
  function updateBoard({ ships }) {
    const updatedShips = ships.map((ship) => {
      return mapShipSections(ship);
    });
    const board = setCellStatus({ ships: updatedShips });
    dispatch({ type: r.SET_BOARD, value: { ships: updatedShips, board } });
  }

  useEffect(() => {
    reset();
  }, [state.status]);
  //-----------------------------------------------MANAGE GAMEBOARD-----------------------------------------------------

  function reset() {
    updateBoard({ ships: initializedShips });
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
    console.log(value);
    dispatch({ type, value });
    const socket = connectSocket({ user: value });
    dispatch({ type: r.SET_SOCKET, value: socket });
  }

  async function registerUser(email, username, password) {
    const {
      data: { type, value },
    } = await axios.post("api/users/register", { email, username, password });
    dispatch({ type, value });
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
      case "LOADING":
        return "yellow";
      case "SELECT":
        return "cyan";
      case "PLAYING":
        return "red";
      default:
        return "green";
    }
  }

  function setStatus({ status }) {
    dispatch({ type: r.SET_STATUS, value: status });
  }

  const { connectSocket, findPartner, cancelMatch, quitMatch } = socketFunctions;

  function playGame({ socket }) {
    findPartner({ socket });
  }

  function cancelFindMatch({ socket }) {
    cancelMatch({ socket });
  }

  function forfeitMatch({ socket, match }) {
    quitMatch({ socket, match });
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
      setStatus,
      setStatusStyle,
      logoutUser,
      playGame,
      cancelFindMatch,
      forfeitMatch,
    },
  };
}
