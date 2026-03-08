import { useContext } from "react";
import { PostContext } from "../posts.context";

export function usePost() {
  const context = useContext(PostContext);
  return context
}
