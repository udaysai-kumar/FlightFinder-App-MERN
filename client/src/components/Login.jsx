import React, { useContext } from 'react';
import { GeneralContext } from '../context/GeneralContext';
import './Login.css';

const Login = ({ setIsLogin }) => {
  const { setEmail, setPassword, login } = useContext(GeneralContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    await login();
  };

  return (
    <div className="login-wrapper d-flex justify-content-center align-items-center">
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="text-center mb-4">Welcome Back</h2>

        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="floatingInput">Email address</label>
        </div>

        <div className="form-floating mb-4">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>

        <button type="submit" className="btn btn-custom w-100">Sign In</button>

        <p className="mt-3 text-center" style={{ fontSize: '0.85rem', textAlign: 'center', marginTop: '10px' }}>
          Not registered?{' '}
          <span className="register-link" onClick={() => setIsLogin(false)}>
            Create an account
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
