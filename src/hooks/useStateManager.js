import { useReducer } from "react";

export default function useStateManager() {
  //---------------------------------------------REDUCER VARIABLES------------------------------------------------------
  const reducerVariables = {
    UPDATE_BOARD: "UPDATE_BOARD",
    SET_SOCKET: "SET_SOCKET",
  };
  const r = reducerVariables;
  //---------------------------------------------------SHIPS------------------------------------------------------------
  const ships = [
    { name: "BATTLESHIP", XY: [0, 0], isVertical: true, size: 5, sections: [] },
    { name: "CRUISER", XY: [1, 0], isVertical: true, size: 4, sections: [] },
    { name: "FRIGATE", XY: [2, 0], isVertical: true, size: 4, sections: [] },
    { name: "DESTROYER", XY: [3, 0], isVertical: true, size: 3, sections: [] },
    { name: "SCOUT", XY: [4, 0], isVertical: true, size: 2, sections: [] },
  ];
  //---------------------------------------------------INIT-------------------------------------------------------------
  const initialState = {
    ships: ships,
    board: [],
    socket: null,
  };
  //--------------------------------------------------REDUCER-----------------------------------------------------------
  const [state, dispatch] = useReducer(reducer, initialState);

  function reducer(state, action) {
    switch (action.type) {
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
      default:
        return { ...state };
    }
  }
  //--------------------------------------------------RETURN------------------------------------------------------------
  return { state, dispatch, r };
}
