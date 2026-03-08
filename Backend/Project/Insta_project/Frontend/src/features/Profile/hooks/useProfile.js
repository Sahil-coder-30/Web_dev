import { useContext } from "react";
import { ProfileContext } from "../profile.context";

export  function useProfile (){
    const context = useContext(ProfileContext);
    return context;
}