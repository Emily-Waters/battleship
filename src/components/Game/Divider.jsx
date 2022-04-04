import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TextsmsIcon from "@mui/icons-material/Textsms";

export default function Divider({ state, setDisplayUserMenu }) {
  const dividerIconStyle = state.user.status === "PLAYING" ? "nav-icon--enabled" : "nav-icon";
  return (
    <nav className="game-divider">
      <AccountCircleIcon
        className={dividerIconStyle}
        onClick={state.user.status === "PLAYING" ? setDisplayUserMenu : null}
      />
      <TextsmsIcon className={dividerIconStyle} />
    </nav>
  );
}
