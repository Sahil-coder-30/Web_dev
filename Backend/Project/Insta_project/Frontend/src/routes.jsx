import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./features/Auth/Pages/Login";
import Register from "./features/Auth/Pages/Register";
import Feed from "./features/Post/pages/Feed";
import Profile from "./features/Profile/pages/Profile";
import EditProfile from "./features/Profile/pages/EditProfile";
import ProfessionalAccount from "./features/Profile/pages/ProfessionalAccount";
import Notifications from "./features/Profile/pages/Notifications";
import PrivacySecurity from "./features/Profile/pages/PrivacySecurity";
import LoginActivity from "./features/Profile/pages/LoginActivity";
import EmailsFromInstagram from "./features/Profile/pages/EmailsFromInstagram";
import Help from "./features/Profile/pages/Help";
import UserProfile from "./features/Profile/pages/UserProfile";
import NotificationsPage from "./features/Notifications/pages/NotificationsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRoute from "./components/AuthRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Feed />} />
          <Route path="/activity" element={<NotificationsPage />} />
          <Route path="/user/:username" element={<UserProfile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/settings/professional" element={<ProfessionalAccount />} />
          <Route path="/settings/notifications" element={<Notifications />} />
          <Route path="/settings/privacy" element={<PrivacySecurity />} />
          <Route path="/settings/login-activity" element={<LoginActivity />} />
          <Route path="/settings/emails" element={<EmailsFromInstagram />} />
          <Route path="/settings/help" element={<Help />} />
        </Route>

        <Route element={<AuthRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
