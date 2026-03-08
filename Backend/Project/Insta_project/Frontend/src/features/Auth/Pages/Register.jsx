import React from "react";
import { Link, useNavigate } from "react-router";
import "../Styles/register_form.scss";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { register } from "../services/auth.api";
import { AuthFormSkeleton } from "../../../components/Skeletons";

const Register = () => {
  const { loading, handleRegister } = useAuth();
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [fullName, setfullName] = useState("");
  const [bio, setbio] = useState("");
  const [profileImage, setprofileImage] = useState(null);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  if (loading) {
    return <AuthFormSkeleton variant="register" />;
  }

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step < 3) {
      handleNext();
      return;
    }

    try {
      const response = await handleRegister(username, password, fullName, email, bio, profileImage ? profileImage : null);
      console.log(response);

      setfullName("");
      setusername("");
      setemail("");
      setpassword("");
      setbio("");
      setprofileImage(null);
      setStep(1);
      navigate('/')
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="auth-main">
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className="input-group">
                <input
                  className="input-group__field"
                  onChange={(e) => setemail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="Email"
                  required
                />
              </div>

              <div className="input-group">
                <input
                  className="input-group__field"
                  onChange={(e) => setpassword(e.target.value)}
                  value={password}
                  type="password"
                  placeholder="Password"
                  required
                />
              </div>

              <button type="submit" className="btn btn--primary">Next</button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="input-group">
                <input
                  className="input-group__field"
                  onChange={(e) => setfullName(e.target.value)}
                  value={fullName}
                  type="text"
                  placeholder="Full Name"
                  required
                />
              </div>

              <div className="input-group">
                <input
                  className="input-group__field"
                  onChange={(e) => setusername(e.target.value)}
                  value={username}
                  type="text"
                  placeholder="Username"
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                <button type="button" className="btn btn--secondary" onClick={handlePrev} style={{ flex: 1 }}>Back</button>
                <button type="submit" className="btn btn--primary" style={{ flex: 1 }}>Next</button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="input-group">
                <input
                  className="input-group__field"
                  onChange={(e) => setbio(e.target.value)}
                  value={bio}
                  type="text"
                  placeholder="Bio"
                />
              </div>

              <div className="input-group" style={{ marginBottom: "0.5rem" }}>
                <label
                  className="input-group__field"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    borderStyle: "dashed",
                    borderWidth: "1.5px",
                    borderColor: profileImage ? "#dd2a7b" : "#3a3a3e",
                    color: profileImage ? "#fff" : "#737373",
                    backgroundColor: profileImage ? "rgba(221, 42, 123, 0.05)" : "#252528",
                    transition: "all 0.2s ease",
                    padding: "1rem"
                  }}
                >
                  <span style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    {profileImage ? "📸 " + profileImage.name : "📸 Upload Profile Photo"}
                  </span>
                  <input
                    onChange={(e) => setprofileImage(e.target.files[0])}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                </label>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                <button type="button" className="btn btn--secondary" onClick={handlePrev} style={{ flex: 1 }}>Back</button>
                <button type="submit" className="btn btn--primary" style={{ flex: 1 }}>Register</button>
              </div>
            </>
          )}
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
