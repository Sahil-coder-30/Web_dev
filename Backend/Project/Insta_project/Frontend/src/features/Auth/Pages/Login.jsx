import React from "react";
import "../Styles/form.scss";
import { Link } from "react-router";
import { useState } from "react";
import axios from "axios";
const Login = () => {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");

  const handelSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(
        "http://localhost:3000/api/auth/login",
        {
          username,
          password,
        },
        {
          withCredentials: true,
        },
      )
      .then((res) => {
        setusername("");
        setpassword("");
      });
  };

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handelSubmit}>
          <input
            onChange={(e) => {
              setusername(e.target.value);
            }}
            value={username}
            type="text"
            placeholder="Username or Email"
          />

          <input
            onChange={(e) => {
              setpassword(e.target.value);
            }}
            value={password}
            type="password"
            placeholder="Password"
          />
          <button>Login</button>
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
