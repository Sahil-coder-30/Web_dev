import { createContext, useState } from "react";
export const PostContext = createContext();
import { getPostsFeed, createPosts } from "./services/post.api";

export const PostContextProvider = ({ children }) => {
  const [loading, setloading] = useState(false);
  const [Post, setPost] = useState(null);
  const [feed, setfeed] = useState(null);

  const getFeed = async () => {
    // Only show global loading spinner on the very first fetch
    if (!feed) setloading(true);
    try {
      const data = await getPostsFeed();
      setfeed(data.data);
    } catch (error) {
      throw error;
    } finally {
      setloading(false);
    }
  };

  const createPost = async (caption, image) => {
    // No global loading — modal manages its own isSubmitting state
    try {
      const data = await createPosts(caption, image);
      setPost(data.data);
    } catch (error) {
      throw error;
    }
  };


  return (
    <PostContext.Provider
      value={{ loading, Post, feed, setloading, setPost, setfeed, getFeed, createPost }}
    >
      {children}
    </PostContext.Provider>
  );
};
