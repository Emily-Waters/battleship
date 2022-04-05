//---------------------------------------------REDUCER VARIABLES------------------------------------------------------
const reducerVariables = {
  SET_USER: "SET_USER",
  SET_ERROR: "SET_ERROR",
  SET_BOARD: "SET_BOARD",
  SET_SOCKET: "SET_SOCKET",
  SET_USER_STATUS: "SET_USER_STATUS",
  SET_MATCH: "SET_MATCH",
  SET_LAST_MATCH: "SET_LAST_MATCH",
  SET_TARGET_BOARD: "SET_TARGET_BOARD",
  SET_TURN: "SET_TURN",
};

const socketVariables = {
  FIND_MATCH: "FIND_MATCH",
  CANCEL_MATCH: "CANCEL_MATCH",
  FORFEIT_MATCH: "FORFEIT_MATCH",
  READY: "READY",
  TARGET_CELL: "TARGET_CELL",
};

const r = reducerVariables;
const s = socketVariables;

module.exports = { r, s };
