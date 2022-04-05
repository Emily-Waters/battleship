export default function TargetBoardCell({ state, isHit, isTarget, socketEmitter, cellXY }) {
  function generateHitMarker() {
    if (isTarget) {
      return isHit ? <div className="board-cell-hitmarker--hit" /> : <div className="board-cell-hitmarker--miss" />;
    }
    return null;
  }
  return (
    <div
      className={isTarget ? "board-cell" : "board-cell--target"}
      onClick={() => {
        !isTarget && socketEmitter(state, { type: "TARGET_CELL", value: { XY: cellXY, match: state.match } });
      }}
    >
      {generateHitMarker()}
    </div>
  );
}
