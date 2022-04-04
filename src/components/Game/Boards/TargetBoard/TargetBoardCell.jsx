export default function TargetBoardCell({ state, isHit, isTarget }) {
  function generateHitMarker() {
    if (isTarget) {
      return isHit ? <div className="board-cell-hitmarker--hit" /> : <div className="board-cell-hitmarker--miss" />;
    }
    return null;
  }
  return <div className="board-cell--target">{generateHitMarker()}</div>;
}
