import { useState } from "react";
import LoginForm from "./Login";
import RegisterForm from "./Register";

export default function Login({ loginFunctions, error }) {
  const [loginView, setLoginView] = useState(true);

  return (
    <div className="login-container">
      {loginView ? (
        <LoginForm loginFunctions={loginFunctions} error={error} setLoginView={() => setLoginView(!loginView)} />
      ) : (
        <RegisterForm loginFunctions={loginFunctions} error={error} setLoginView={() => setLoginView(!loginView)} />
      )}
    </div>
  );
}
