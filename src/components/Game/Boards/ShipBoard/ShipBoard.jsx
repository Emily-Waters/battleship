import React from "react";
import "../Board.scss";
import BoardCell from "./BoardCell";

function ShipBoard({ state, gameFunctions }) {
  function renderBoard({ ships, board }) {
    return board.map((row, index) => {
      return (
        <div className="board-row" key={index}>
          {row.map((cell) => {
            const ship = ships.find((ship) =>
              ship.sections.find((section) => section.XY[0] === cell.XY[0] && section.XY[1] === cell.XY[1])
            );
            return <BoardCell key={cell.id} cellXY={cell.XY} state={state} ship={ship} gameFunctions={gameFunctions} />;
          })}
        </div>
      );
    });
  }
  return <div className="board-container">{renderBoard(state)}</div>;
}

export default React.memo(ShipBoard);
