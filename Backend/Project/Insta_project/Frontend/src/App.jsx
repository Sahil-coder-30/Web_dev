import React from "react";
import AppRoutes from "./routes";
import "./style.scss";
import { AuthProvider } from "./features/Auth/auth.context.jsx";
import { PostContextProvider } from "./features/Post/posts.context.jsx";
import { ProfileContextProvider } from "./features/Profile/profile.context.jsx";
const App = () => {
  return (
    <AuthProvider>
      <ProfileContextProvider>
        <PostContextProvider>
          <AppRoutes />
        </PostContextProvider>
      </ProfileContextProvider>
    </AuthProvider>
  );
};

export default App;
