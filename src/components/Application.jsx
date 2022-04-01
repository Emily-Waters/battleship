import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TextsmsIcon from "@mui/icons-material/Textsms";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import useApplicationData from "../hooks/useApplicationData";
import useSocketMan from "../hooks/useSocketMan";
import "./Application.scss";
import Login from "./Login/index";
import UserMenu from "./Menu/UserMenu";
import Placement from "./Placement";

export default function App() {
  const { state, dispatch, loginFunctions, menuFunctions, shipFunctions } = useApplicationData();

  const [displayUserMenu, setDisplayUserMenu] = useState(true);

  useSocketMan(state, dispatch);

  const { logoutUser } = loginFunctions;

  return (
    <div className="App">
      {!state.user ? (
        <Login loginFunctions={loginFunctions} error={state.error} />
      ) : (
        <>
          <div className="game-container-left">
            <UserMenu
              state={state}
              logoutUser={() => logoutUser()}
              menuFunctions={menuFunctions}
              displayUserMenu={displayUserMenu}
            />

            {state.status === "PLAYING" &&
              {
                /* TARGET BOARD HERE */
              }}
          </div>
          <nav className="game-divider">
            <AccountCircleIcon className={"nav-icon"} onClick={() => setDisplayUserMenu(!displayUserMenu)} />
            <TextsmsIcon className={"nav-icon"} />
          </nav>
          <div className="game-container-right">
            <span className="game-options">
              {!state.status && <>RULES</>}
              {state.status === "SELECT" && <>SELECT</>}
              {state.status === "LOADING" && <>LOADING</>}
            </span>
            {state.status === "PLAYING" && (
              <DndProvider backend={HTML5Backend}>
                <Placement state={state} shipFunctions={shipFunctions} logoutUser={() => logoutUser()} />
              </DndProvider>
            )}
          </div>
        </>
      )}
    </div>
  );
}
