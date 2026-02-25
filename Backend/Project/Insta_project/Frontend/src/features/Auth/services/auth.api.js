import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true,
});

export async function register(username, password, fullName, email, bio) {
  try {
    const response = await api.post("/register", {
      username,
      email,
      bio,
      fullName,
      password,
    });

    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function login(username, password) {
  try {
    const response = await api.post("/login", {
      username,
      password,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getMe() {
  try {
    const response = await api.get("/getMe");
    return response.data;
  } catch (error) {
    throw error;
  }
}

