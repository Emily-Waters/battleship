import React from "react";
import "../Board.scss";
import TargetBoardCell from "./TargetBoardCell";

function TargetBoard({ state, socketEmitter }) {
  function renderTargetBoard({ targetBoard }) {
    console.log(targetBoard);
    return targetBoard.map((row, index) => {
      return (
        <div className="board-row" key={index}>
          {row.map((cell) => {
            return (
              <TargetBoardCell
                key={cell.id}
                cellXY={cell.XY}
                state={state}
                isTarget={cell.isTarget}
                isHit={cell.isHit}
                socketEmitter={socketEmitter}
              />
            );
          })}
        </div>
      );
    });
  }
  return (
    <div className="board-container">
      {state.user.status === "SETUP" && <div className="board-overlay"></div>}
      {renderTargetBoard(state)}
    </div>
  );
}

export default React.memo(TargetBoard);
