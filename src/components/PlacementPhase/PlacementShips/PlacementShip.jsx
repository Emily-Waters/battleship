import React from "react";
import { useDrag } from "react-dnd";
import "./PlacementShip.scss";

function PlacementShip({ shipItem, changeShipRotation, shipState, gameBoardState }) {
  const shipStyle = shipItem.isVertical
    ? { height: `calc(7.5vh*${shipItem.size} - 1.5vh)`, width: "6vh" }
    : { width: `calc(7.5vh * ${shipItem.size} - 1.5vh)`, height: "6vh" };

  function handleClick() {
    changeShipRotation(shipItem, shipState, gameBoardState);
  }

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: shipItem.name,
      item: shipItem,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [shipState]
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
