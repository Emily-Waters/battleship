import PlacementBoardCell from "./PlacementBoardCell";
import "./PlacementPhase.scss";

export default function PlacementBoard({ gameBoardState, shipState, changeShipRotation, canMoveShip, moveShip }) {
  function renderBoard(gameBoardState) {
    return gameBoardState.map((row) => {
      return (
        <div className="board-row">
          {row.map((cell) => {
            const shipItem = shipState.find((ship) =>
              ship.sections.find((section) => section.XY[0] === cell.XY[0] && section.XY[1] === cell.XY[1])
            );
            return (
              <PlacementBoardCell
                key={cell.id}
                cellXY={cell.XY}
                shipItem={shipItem}
                changeShipRotation={changeShipRotation}
                canMoveShip={canMoveShip}
                moveShip={moveShip}
                shipState={shipState}
                gameBoardState={gameBoardState}
              />
            );
          })}
        </div>
      );
    });
  }

  return <div className={"placement-board"}>{renderBoard(gameBoardState)}</div>;
}
