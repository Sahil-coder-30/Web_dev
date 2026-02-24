import React from "react";
import { Link } from "react-router";
import "../Styles/register_form.scss";
import axios from "axios";
import { useState } from "react";

const Register = () => {
  const [username, setusername] = useState("")
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [fullName, setfullName] = useState("");
  const [bio, setbio] = useState("");

  const handleSubmit = async (e) => {
    console.log(username, email, fullName, password, bio);
    e.preventDefault();
    await axios.post("http://localhost:3000/api/auth/register", {
      username,
      email,
      password,
      fullName,
      bio
    }, {
      withCredentials: true
    })
      .then((res) => {
        console.log(res.data);
        setfullName("");
        setusername("");
        setemail("");
        setpassword("");
        setbio("");
      })
  };

  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input
            onChange={(e) => {
              setfullName(e.target.value);
            }}
            value={fullName}
            type="text"
            placeholder="Full Name"
          />

          <input
            onChange={(e) => {
              setusername(e.target.value);
            }}
            value={username}
            type="text"
            placeholder="Username"
          />

          <input
            onChange={(e) => {
              setemail(e.target.value);
            }}
            value={email}
            type="email"
            placeholder="Email"
          />

          <input
            onChange={(e) => {
              setbio(e.target.value);
            }}
            value={bio}
            type="text"
            placeholder="Bio"
          />

          <input
            onChange={(e) => {
              setpassword(e.target.value);
            }}
            value={password}
            type="password"
            placeholder="Password"
          />

          <button

          >
            Register
          </button>
        </form>
        <p>
          Already have an account?{" "}
          <Link className="toggleAuthForm" to="/login">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
