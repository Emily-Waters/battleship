import useApplicationData from "../hooks/useApplicationData";
import { socketEmitter } from "../hooks/useSocketMan";
import "./Application.scss";
import Game from "./Game";
import Login from "./Login/";

export default function App() {
  const { state, dispatch, userFunctions, gameFunctions } = useApplicationData();

  return (
    <div className="App">
      {!state.user ? (
        <Login userFunctions={userFunctions} error={state.error} />
      ) : (
        <Game
          state={state}
          userFunctions={userFunctions}
          gameFunctions={gameFunctions}
          dispatch={dispatch}
          socketEmitter={socketEmitter}
        />
      )}
    </div>
  );
}
