import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER,
  withCredentials: true,
});

export const getProfile = async () => {
  try {
    const myProfile = await api.get("/api/auth/getMe");
    return myProfile.data;
  } catch (err) {
    throw err;
  }
};

export const allMyPosts = async () => {
  try {
    const allPosts = await api.get("/api/posts");
    return allPosts.data;
  } catch (error) {
    throw error;
  }
};

export const allFollowers = async () => {
  try {
    const followers = await api.get("/api/users/followers");
    const { AllFollowers } = followers.data;
    console.log(followers.data)
    return AllFollowers;
  } catch (error) {
    throw err;
  }
};

export const userProfile = async (username) => {
  try {
    const userData = await api.get(`/api/users/${username}`);
    // console.log(userData.data.Data)
    return userData.data.Data;
  } catch (error) {
    throw error;
  }
};

export const userPosts = async (username) => {
  try {
    const res = await api.get(`/api/posts/?username=${username}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
