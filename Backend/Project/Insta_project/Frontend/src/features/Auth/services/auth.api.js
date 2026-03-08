import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER,
  withCredentials: true,
});

export async function register(username, password, fullName, email, bio, profilePic) {
  try {
    let data;
    let headers = {};
    if (profilePic) {
      data = new FormData();
      data.append("username", username);
      data.append("email", email);
      data.append("bio", bio);
      data.append("fullName", fullName);
      data.append("password", password);
      data.append("image", profilePic);
      headers["Content-Type"] = "multipart/form-data";
    } else {
      data = {
        username,
        email,
        bio,
        fullName,
        password,
      };
    }

    const response = await api.post("/api/auth/register", data, { headers });

    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function login(username, password) {
  try {
    const response = await api.post("/api/auth/login", {
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
    const response = await api.get("/api/auth/getMe");
    return response.data;
  } catch (error) {
    throw error;
  }
}
