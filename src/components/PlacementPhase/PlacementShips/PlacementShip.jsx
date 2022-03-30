import React from "react";
import { useDrag } from "react-dnd";
import "./PlacementShip.scss";

//4 * (#OfSections) - 0.5
function PlacementShip({ ship, canRotateShip, rotateShip, state }) {
  const shipClass = ship.isVertical ? "ship-container--rotated" : "ship-container";
  const shipStyle = { height: `calc(4vw * ${ship.size} - 0.5vw)` };
  function handleClick() {
    if (canRotateShip(ship, state)) {
      rotateShip(ship, state);
    }
  }

  function mapHitMarkers(ship) {
    return ship.sections.map(({ isHit }, i) => {
      return (
        <div
          className="ship-hitmarker"
          key={i}
          style={{
            backgroundColor: isHit ? "rgb(225, 0, 0)" : "grey",
            top: `${i * 4 + 1}vw`,
            left: "1vw",
          }}
        />
      );
    });
  }

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ship.name,
      item: { ship },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [state.ships]
  );

  return (
    <div
      ref={drag}
      onClick={handleClick}
      className={shipClass}
      style={{
        ...shipStyle,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isDragging ? "green" : "lightgray",
      }}
    >
      {mapHitMarkers(ship)}
    </div>
  );
}

export default React.memo(PlacementShip);
