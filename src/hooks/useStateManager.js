import { useReducer } from "react";

export default function useStateManager() {
  const reducerVariables = {
    SET_PLACEMENT_BOARD: "SET_PLACEMENT_BOARD",
    UPDATE_SHIPS: "UPDATE_SHIPS",
    UPDATE_GAME_BOARD: "UPDATE_GAME_BOARD",
  };

  const r = reducerVariables;

  const initialState = {
    ships: [],
    placementBoard: [],
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  function reducer(state, action) {
    switch (action.type) {
      case r.SET_PLACEMENT_BOARD:
        return {
          ...state,
          ships: action.value.ships,
          placementBoard: action.value.placementBoard,
        };
      case r.UPDATE_SHIPS:
        return {
          ...state,
          ships: action.value,
        };
      case r.UPDATE_GAME_BOARD:
        return {
          ...state,
          placementBoard: action.value,
        };

      default:
        return { ...state };
    }
  }

  return { state, dispatch, r };
}
