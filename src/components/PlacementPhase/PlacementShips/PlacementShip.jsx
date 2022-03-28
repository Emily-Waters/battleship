import React from "react";
import { useDrag } from "react-dnd";
import "./PlacementShip.scss";

function PlacementShip({ currentShip, changeShipRotation, state }) {
  const shipStyle = currentShip.isVertical
    ? { height: `calc(7.5vh*${currentShip.size} - 1.5vh)`, width: "6vh" }
    : { width: `calc(7.5vh * ${currentShip.size} - 1.5vh)`, height: "6vh" };

  function handleClick() {
    changeShipRotation(currentShip, state);
  }

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: currentShip.name,
      item: currentShip,
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
      className="ship-container"
      style={{
        ...shipStyle,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isDragging ? "green" : "lightgray",
      }}
    ></div>
  );
}

export default React.memo(PlacementShip);
