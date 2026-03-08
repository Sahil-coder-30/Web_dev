import { createContext, useState, useEffect } from "react";
import { login, register, getMe } from "./services/auth.api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setuser] = useState(null);
  const [loading, setloading] = useState(false);
  const [currentUser, setcurrentUser] = useState(null)

  const handleLogin = async (username, password) => {
    setloading(true);

    try {
      const response = await login(username, password);

      setuser(response);
      return response;
    } catch (err) {
      throw err;
    } finally {
      setloading(false);
    }
  };

  const handleRegister = async (username, password, fullName, email, bio, profilePic) => {
    setloading(true);

    try {
      const response = await register(username, password, fullName, email, bio, profilePic);
      setuser(response);
      return response;
    } catch (err) {
      throw err;
    } finally {
      setloading(false);
    }
  };

  const currentUserData = async () => {
    setloading(true);
    try {
      const data = await getMe();
      setcurrentUser(data);
      setloading(false);
      return data;
    } catch (err) {
      throw err;
    }
    finally {
      setloading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, handleLogin, handleRegister, currentUserData, currentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
