import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import { socketEmitter } from "../../hooks/useSocketMan";
import Button from "./Button/Button";
import "./Game.scss";

export default function SideBar({ state, userFunctions, gameFunctions }) {
  const { setUserStatus, logoutUser, reset } = userFunctions;

  let buttonText = "";
  let buttonStyle = "";
  let statusStyle = "";

  if (state.user) {
    switch (state.user.status) {
      case null:
        buttonText = "Play";
        buttonStyle = "accept";
        statusStyle = "accept";
        break;
      case "WAITING":
        if (!state.match) {
          buttonText = "Cancel";
          buttonStyle = "warning";
          statusStyle = "warning";
        } else {
          buttonText = "Forfeit";
          buttonStyle = "cancel";
          statusStyle = "warning";
        }
        break;
      case "SETUP":
        buttonText = "Ready";
        buttonStyle = "accept";
        statusStyle = "accept";
        break;
      case "READY":
        buttonText = "Cancel";
        buttonStyle = "warning";
        statusStyle = "warning";
        break;
      case "PLAYING":
        buttonText = "Forfeit";
        buttonStyle = "cancel";
        statusStyle = "cancel";
        break;
      case "DEBRIEF":
        buttonText = "Menu";
        buttonStyle = "info";
        statusStyle = "info";
        break;
      default:
        break;
    }
  }

  function handleClick(state) {
    if (state.user) {
      switch (state.user.status) {
        case null:
          socketEmitter(state, { type: "FIND_MATCH", value: null });
          reset();
          break;
        case "WAITING":
          if (!state.match) {
            socketEmitter(state, { type: "CANCEL_MATCH", value: null });
          } else {
            socketEmitter(state, { type: "FORFEIT_MATCH", value: null });
          }
          break;
        case "SETUP":
          socketEmitter(state, {
            type: "READY",
            value: { ships: state.ships, board: state.board, targetBoard: state.targetBoard },
          });
          break;
        case "READY":
          socketEmitter(state, { type: "FIND_MATCH", value: null });
          break;
        case "PLAYING":
          socketEmitter(state, { type: "FORFEIT_MATCH", value: null });
          break;
        case "DEBRIEF":
          setUserStatus({ status: null, msg: "" });
          break;
        default:
          break;
      }
    }
  }

  return (
    <>
      {state.user && (
        <>
          <div className="user-status-container">
            <div className="radar-container">
              {state.user.status === "WAITING" && <TrackChangesIcon className="radar" />}
            </div>
            <div className={"user-status--" + statusStyle}>{state.user.status || "MENU"}</div>
          </div>
          <nav className="user-btns">
            <Button
              text={buttonText}
              buttonType={"button"}
              buttonStyle={buttonStyle}
              handleClick={() => handleClick(state)}
            />
            <Button
              text={"Logout"}
              buttonType={"button"}
              buttonStyle={"cancel"}
              handleClick={() => logoutUser(state)}
            />
          </nav>
        </>
      )}
    </>
  );
}
