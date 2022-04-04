export default function Overlay({ canDrop }) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        opacity: 0.4,
        backgroundColor: canDrop ? "green" : "red",
        position: "absolute",
        zIndex: 2,
      }}
    ></div>
  );
}
