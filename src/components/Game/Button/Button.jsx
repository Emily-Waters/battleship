import "./Button.scss";

export default function Button({ text, buttonType, buttonStyle, handleClick }) {
  const buttonClass = "btn--" + buttonStyle;
  return (
    <button className={buttonClass} onClick={handleClick} type={buttonType}>
      {text}
    </button>
  );
}
