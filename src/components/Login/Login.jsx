import { useState } from "react";
import Button from "../Game/Button/Button";
import "./Login.scss";
export default function LoginForm({ userFunctions, socketFunctions, error, setLoginView }) {
  const { validateUser, clearErrors } = userFunctions;
  const [email, setEmail] = useState("emily@emily.com");
  const [password, setPassword] = useState("password");

  return (
    <div className="login-container">
      <h2 className="login-title">SHATTLEBIP</h2>
      <span className="login-error" style={{ opacity: error ? 1 : 0 }}>
        {error}
      </span>
      <form
        className="login-form"
        onSubmit={(e) => {
          e.preventDefault();
          validateUser(email, password);
        }}
      >
        <span className="login-form-line">
          <label htmlFor="email" className="login-form-label">
            Email&nbsp;:&nbsp;
          </label>
          <input
            type="email"
            className="login-form-input"
            placeholder="example@example.com"
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
            placeholder="password"
            required
            value={password}
            onChange={(e) => {
              if (error) clearErrors();
              setPassword(e.target.value);
            }}
          />
        </span>

        <span className="login-form-line"></span>

        <span className="login-btn-container">
          <Button text={"Register"} buttonType={"button"} buttonStyle={"warning"} handleClick={setLoginView} />
          <Button text={"Login"} buttonType={"submit"} buttonStyle={"accept"} handleClick={() => clearErrors()} />
        </span>
      </form>
    </div>
  );
}
