import React from "react";
import "../Styles/form.scss";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { AuthFormSkeleton } from "../../../components/Skeletons";
const Login = () => {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const { handleLogin, user, loading ,currentUserData } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <AuthFormSkeleton variant="login" />;
  }

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await handleLogin(username, password);
      await currentUserData();
      console.log(res);
      setpassword("");
      setusername("");
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <main className="auth-main">
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handelSubmit}>
          <div className="input-group">
            <input
              className="input-group__field"
              onChange={(e) => {
                setusername(e.target.value);
              }}
              value={username}
              type="text"
              placeholder="Username or Email"
            />
          </div>

          <div className="input-group">
            <input
              className="input-group__field"
              onChange={(e) => {
                setpassword(e.target.value);
              }}
              value={password}
              type="password"
              placeholder="Password"
            />
          </div>
          <button className="btn btn--primary">Login</button>
        </form>
        <p>
          Don't have an account?{" "}
          <Link className="toggleAuthForm" to="/register">
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
