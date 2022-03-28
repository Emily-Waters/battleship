import PlacementBoardCell from "./PlacementBoardCell";
import "./PlacementPhase.scss";

export default function PlacementBoard({ state, canRotateShip, rotateShip, canMoveShip, moveShip }) {
  function renderBoard({ ships, board }) {
    return board.map((row, index) => {
      return (
        <div className="board-row" key={index}>
          {row.map((cell) => {
            const ship = ships.find((ship) =>
              ship.sections.find((section) => section.XY[0] === cell.XY[0] && section.XY[1] === cell.XY[1])
            );
            return (
              <PlacementBoardCell
                key={cell.id}
                cellXY={cell.XY}
                state={state}
                ship={ship}
                canRotateShip={canRotateShip}
                rotateShip={rotateShip}
                canMoveShip={canMoveShip}
                moveShip={moveShip}
              />
            );
          })}
        </div>
      );
    });
  }
  return <div className={"placement-board"}>{renderBoard(state)}</div>;
}
