import useApplicationData from "../hooks/useApplicationData";
import { socketEmitter } from "../hooks/useSocketMan";
import "./Application.scss";
import Game from "./Game/Game";
import SideBar from "./Game/SideBar";
import Login from "./Login";
export default function App() {
  const { state, dispatch, userFunctions, gameFunctions } = useApplicationData();

  return (
    <div className="main-container">
      <div className="game-container">
        {!state.user && <Login userFunctions={userFunctions} error={state.error} />}
        {state.user && (
          <Game
            state={state}
            userFunctions={userFunctions}
            gameFunctions={gameFunctions}
            dispatch={dispatch}
            socketEmitter={socketEmitter}
          />
        )}
      </div>
      <div className="sidebar">
        <SideBar state={state} userFunctions={userFunctions} gameFunctions={gameFunctions} />
      </div>
    </div>
  );
}
