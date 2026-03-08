import { createContext, useContext, useState } from "react";
import { getProfile, allMyPosts, allFollowers, userProfile, allFollowing } from "../Profile/services/profile.api";

export const ProfileContext = createContext();

export const ProfileContextProvider = ({ children }) => {
  const [postsData, setpostsData] = useState(null);
  const [profileData, setprofileData] = useState(null);
  const [loading, setloading] = useState(false);
  const [followers, setfollowers] = useState(null);
  const [following, setfollowing] = useState(null);
  const [userProfileData, setuserProfileData] = useState(null);

  const getProfileData = async () => {
    setloading(true);
    try {
      const allprofileData = await getProfile();
      setprofileData(allprofileData);
      setloading(false);
    } catch (error) {
      throw error;
    } finally {
      setloading(false);
    }
  };


  const getAllPosts = async () => {
    setloading(true);
    try {
      const allpostData = await allMyPosts();
      setpostsData(allpostData);
      setloading(false);
    } catch (error) {
      throw error;
    } finally {
      setloading(false);
    }
  };

  const Allfollowers = async (username) => {
    try {
      const followerData = await allFollowers(username);
      setfollowers(followerData);
    } catch (err) {
      console.error("Error fetching followers:", err);
    }
  };

  const Allfollowing = async (username) => {
    try {
      const followingData = await allFollowing(username);
      setfollowing(followingData);
    } catch (err) {
      console.error("Error fetching following:", err);
    }
  };

  const userProfileHandller = async (username) => {
    setloading(true);
    try {
      const data = await userProfile(username);
      // console.log(data.message);
      if (data.message === "You are opening your own Profile....") {
        setloading(false);
        setuserProfileData(null);
        return false;
      }
      setuserProfileData(data?.Data);
      // console.log(userProfileData);
      setloading(false)
    } catch (error) {
      setloading(false);
      throw error
    }
    finally {
      setloading(false);
    }
  }


  return (
    <ProfileContext.Provider value={{ getProfileData, getAllPosts, Allfollowers, Allfollowing, userProfileHandller, userProfileData, followers, following, profileData, postsData, loading }}>
      {children}
    </ProfileContext.Provider>
  )
};
