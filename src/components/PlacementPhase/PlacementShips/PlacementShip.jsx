import React from "react";
import { useDrag } from "react-dnd";
import "./PlacementShip.scss";

function PlacementShip({ ship, canRotateShip, rotateShip, state }) {
  const shipClass = ship.isVertical ? "ship-container--rotated" : "ship-container";
  const shipStyle = { height: `calc(4vw * ${ship.size} - 0.5vw)` };
  function handleClick() {
    if (canRotateShip(ship, state)) {
      rotateShip(ship, state);
    }
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
    />
  );
}

export default React.memo(PlacementShip);
