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

export const allFollowers = async (username) => {
  try {
    const followers = await api.get(`/api/users/followers/${username}`);
    return followers.data.userFollowers;
  } catch (error) {
    throw error;
  }
};

export const allFollowing = async (username) => {
  try {
    const following = await api.get(`/api/users/following/${username}`);
    return following.data.userFollowing;
  } catch (error) {
    throw error;
  }
};

export const userProfile = async (username) => {
  try {
    const userData = await api.get(`/api/users/${username}`);
    // Return the full data payload to check message, isFollowing, and Data
    return userData.data;
  } catch (error) {
    throw error;
  }
};

export const userPosts = async (username) => {
  try {
    const res = await api.get(`/api/posts/${username}`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getFollowRequests = async () => {
  try {
    const res = await api.get("/api/users/follow");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const requestFollow = async (username) => {
  try {
    const res = await api.post(`/api/users/follow/request/${username}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const acceptFollowRequest = async (username) => {
  try {
    const res = await api.post(`/api/users/follow/accept/${username}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const rejectFollowRequest = async (username) => {
  try {
    const res = await api.post(`/api/users/follow/reject/${username}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const unfollowUser = async (username) => {
  try {
    const res = await api.post(`/api/users/unfollow/${username}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
