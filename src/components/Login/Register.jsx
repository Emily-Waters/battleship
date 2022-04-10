import { useState } from "react";
import Button from "../Game/Button/Button";

export default function RegisterForm({ userFunctions, error, setLoginView }) {
  const { registerUser, clearErrors } = userFunctions;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="login-container">
      <h2 className="login-title">SHATTLEBIP</h2>
      <span className="login-error" style={{ opacity: error ? 1 : 0 }}>
        {error}
      </span>
      <form
        className="login-form"
        onSubmit={async (e) => {
          e.preventDefault();
          registerUser(email, username, password);
        }}
      >
        <span className="login-form-line">
          <label htmlFor="name" className="login-form-label">
            Username&nbsp;:&nbsp;
          </label>
          <input
            type="text"
            className="login-form-input"
            required
            value={username}
            onChange={(e) => {
              if (error) clearErrors();
              setUsername(e.target.value);
            }}
          />
        </span>
        <span className="login-form-line">
          <label htmlFor="email" className="login-form-label">
            Email&nbsp;:&nbsp;
          </label>
          <input
            type="email"
            className="login-form-input"
            required
            value={email}
            onChange={(e) => {
              if (error) clearErrors();
              setEmail(e.target.value);
            }}
          />
        </span>
        <span className="login-form-line">
          <label htmlFor="password" className="login-form-label">
            Password&nbsp;&nbsp;:&nbsp;
          </label>
          <input
            type="password"
            className="login-form-input"
            required
            value={password}
            onChange={(e) => {
              if (error) clearErrors();
              setPassword(e.target.value);
            }}
          />
        </span>
        <span className="login-btn-container">
          <Button text={"Back"} buttonType={"button"} buttonStyle={"cancel"} handleClick={setLoginView} />
          <Button
            text={"Create"}
            buttonType={"submit"}
            buttonStyle={"accept"}
            handleClick={() => registerUser(username, email, password)}
          />
        </span>
      </form>
    </div>
  );
}
