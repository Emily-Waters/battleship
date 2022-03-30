import { useState } from "react";
import "./Login.scss";

export default function Login({ loginFunctions }) {
  const { validateUser } = loginFunctions;
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="login-container">
      <h2 className="login-title">BATTLESHIP</h2>
      <form
        className="login-form"
        onSubmit={(e) => {
          e.preventDefault();
          validateUser(name, password);
        }}
      >
        <label htmlFor="Username" className="login-form-label">
          Username&nbsp;:&nbsp;
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label htmlFor="Password" className="login-form-label">
          Password&nbsp;&nbsp;:&nbsp;
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button className="login-form-btn">Login</button>
      </form>
    </div>
  );
}
