import { useState } from "react";
import "./Login.scss";
export default function Login({ loginFunctions, error }) {
  const { validateUser, clearErrors } = loginFunctions;
  const [name, setName] = useState("");
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
          validateUser(name, password);
        }}
      >
        <label htmlFor="Username" className="login-form-label">
          Username&nbsp;:&nbsp;
          <input
            type="text"
            required
            value={name}
            onChange={(e) => {
              if (error) clearErrors();
              setName(e.target.value);
            }}
          />
        </label>
        <label htmlFor="Password" className="login-form-label">
          Password&nbsp;&nbsp;:&nbsp;
          <input
            type="password"
            required
            value={password}
            onChange={(e) => {
              if (error) clearErrors();
              setPassword(e.target.value);
            }}
          />
        </label>
        <span className="login-btn-container">
          <button type="button" className="login-form-btn">
            Register
          </button>
          <button type="submit" className="login-form-btn">
            Login
          </button>
        </span>
      </form>
    </div>
  );
}
