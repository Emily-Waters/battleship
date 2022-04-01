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

  ships.forEach((ship) => {
    ship.sections = Array.from(Array(ship.size)).map((_, i) => {
      return { id: i, isHit: false, XY: ship.isVertical ? [ship.XY[0], ship.XY[1] + i] : [ship.XY[0] + i, ship.XY[1]] };
    });
  });
  //---------------------------------------------------INIT-------------------------------------------------------------
  const initialState = {
    user: null,
    ships: ships,
    board: [],
    socket: null,
    status: null,
  };
  //--------------------------------------------------REDUCER-----------------------------------------------------------
  const [state, dispatch] = useReducer(reducer, initialState);

  function reducer(state, action) {
    switch (action.type) {
      case r.UPDATE_USER:
        return {
          ...state,
          user: action.value,
        };
      case r.UPDATE_BOARD:
        return {
          ...state,
          ships: action.value.ships,
          board: action.value.board,
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
      case r.SET_USER_POOL:
        return { ...state, userPool: action.value };
      case r.SET_STATUS:
        return {
          ...state,
          status: action.value,
        };
      default:
        return { ...state };
    }
  }
  //--------------------------------------------------RETURN------------------------------------------------------------
  return { state, dispatch };
}
