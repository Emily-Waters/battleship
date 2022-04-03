import { useState } from "react";
import LoginForm from "./Login";
import RegisterForm from "./Register";

export default function Login({ userFunctions, socketFunctions, error }) {
  const [loginView, setLoginView] = useState(true);

  return (
    <div className="login-container">
      {loginView ? (
        <LoginForm
          userFunctions={userFunctions}
          socketFunctions={socketFunctions}
          error={error}
          setLoginView={() => setLoginView(!loginView)}
        />
      ) : (
        <RegisterForm userFunctions={userFunctions} error={error} setLoginView={() => setLoginView(!loginView)} />
      )}
    </div>
  );
}
