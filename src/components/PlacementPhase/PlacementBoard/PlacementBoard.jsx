import PlacementBoardCell from "./PlacementBoardCell";
import "./PlacementPhase.scss";

export default function PlacementBoard({ state, changeShipRotation, canMoveShip, moveShip }) {
  function renderBoard({ ships, board }) {
    console.log(ships);
    return board.map((row) => {
      return (
        <div className="board-row">
          {row.map((cell) => {
            const currentShip = ships.find((ship) =>
              ship.sections.find((section) => section.XY[0] === cell.XY[0] && section.XY[1] === cell.XY[1])
            );
            return (
              <PlacementBoardCell
                key={cell.id}
                cellXY={cell.XY}
                state={state}
                currentShip={currentShip}
                changeShipRotation={changeShipRotation}
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
