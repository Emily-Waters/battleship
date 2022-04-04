import { useReducer } from "react";
import { r } from "../util/constants";
export default function useStateManager() {
  //---------------------------------------------------SHIPS------------------------------------------------------------
  const ships = [
    { name: "BATTLESHIP", XY: [0, 0], isVertical: true, size: 5, sections: [] },
    { name: "CRUISER", XY: [1, 0], isVertical: true, size: 4, sections: [] },
    { name: "FRIGATE", XY: [2, 0], isVertical: true, size: 4, sections: [] },
    { name: "DESTROYER", XY: [3, 0], isVertical: true, size: 3, sections: [] },
    { name: "SCOUT", XY: [4, 0], isVertical: true, size: 2, sections: [] },
  ];

  const initializedShips = ships.map((ship, i) => {
    return {
      ...ship,
      sections: Array.from(Array(ship.size)).map((section, i) => {
        return {
          id: i,
          isHit: false,
          XY: ship.isVertical ? [ship.XY[0], ship.XY[1] + i] : [ship.XY[0] + i, ship.XY[1]],
        };
      }),
    };
  });

  //---------------------------------------------------INIT-------------------------------------------------------------
  const initialState = {
    user: null,
    ships: initializedShips,
    board: [],
    targetBoard: [],
    socket: null,
    status: null,
    match: null,
    lastMatch: null,
  };
  //--------------------------------------------------REDUCER-----------------------------------------------------------
  const [state, dispatch] = useReducer(reducer, initialState);

  function reducer(state, action) {
    console.log("ACTION TYPE : ", action.type);
    console.log("ACTION VALUE:", action.value);
    switch (action.type) {
      case r.SET_USER:
        return {
          ...state,
          user: action.value,
        };
      case r.SET_USER_STATUS:
        const user = { ...state.user };
        return {
          ...state,
          user: { ...user, status: action.value.status, msg: action.value.msg },
        };
      case r.SET_LAST_MATCH:
        return {
          ...state,
          lastMatch: action.value,
        };
      case r.SET_BOARD:
        return {
          ...state,
          ships: action.value.ships,
          board: action.value.board,
        };
      case r.SET_TARGET_BOARD:
        return {
          ...state,
          targetBoard: action.value,
        };
      case r.SET_SOCKET:
        return {
          ...state,
          socket: action.value,
        };
      case r.SET_ERROR:
        return {
          ...state,
          error: action.value,
        };

      case r.SET_MATCH:
        return {
          ...state,
          match: action.value,
        };
      default:
        return { ...state };
    }
  }

  //--------------------------------------------------RETURN------------------------------------------------------------
  return { state, dispatch, initializedShips };
}
