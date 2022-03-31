import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import useApplicationData from "../hooks/useApplicationData";
import useSocketMan from "../hooks/useSocketMan";
import "./Application.scss";
import Login from "./Login/Login";
import Placement from "./Placement";
export default function App() {
  const { state, dispatch, shipFunctions, loginFunctions } = useApplicationData();

  useSocketMan(state, dispatch);

  return (
    <div className="App">
      {!state.user ? (
        <Login loginFunctions={loginFunctions} error={state.error} />
      ) : (
        <DndProvider backend={HTML5Backend}>
          <Placement state={state} shipFunctions={shipFunctions} />
        </DndProvider>
      )}
    </div>
  );
}
