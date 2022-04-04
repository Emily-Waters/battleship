import { useState } from "react";
import Divider from "./Divider";
import PanelA from "./PanelA";
import PanelB from "./PanelB";

export default function Game({ state, userFunctions, gameFunctions }) {
  const [displayUserMenu, setDisplayUserMenu] = useState(true);
  const { logoutUser } = userFunctions;

  return (
    <>
      <PanelA
        state={state}
        userFunctions={userFunctions}
        gameFunctions={gameFunctions}
        logoutUser={() => logoutUser(state)}
        displayUserMenu={displayUserMenu}
      />
      <Divider state={state} setDisplayUserMenu={() => setDisplayUserMenu(!displayUserMenu)} />
      <PanelB
        state={state}
        userFunctions={userFunctions}
        gameFunctions={gameFunctions}
        setDisplayUserMenu={() => setDisplayUserMenu(false)}
      />
    </>
  );
}
