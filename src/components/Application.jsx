import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import useApplicationData from "../hooks/useApplicationData";
import useSocketMan from "../hooks/useSocketMan";
import "./Application.scss";
import Login from "./Login/index";
import Menu from "./Menu";
import Placement from "./Placement";
export default function App() {
  const { state, dispatch, loginFunctions, menuFunctions, shipFunctions } = useApplicationData();

  useSocketMan(state, dispatch);

  const { logoutUser } = loginFunctions;

  return (
    <div className="App">
      {!state.user ? (
        <Login loginFunctions={loginFunctions} error={state.error} />
      ) : (
        <>
          {!state.game ? (
            <Menu state={state} menuFunctions={menuFunctions} logoutUser={logoutUser} />
          ) : (
            <DndProvider backend={HTML5Backend}>
              <Placement state={state} shipFunctions={shipFunctions} logoutUser={() => logoutUser()} />
            </DndProvider>
          )}
        </>
      )}
    </div>
  );
}
