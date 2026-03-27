import { useDispatch } from "react-redux";
import { setUser, setLoading, setError } from "../auth.slice";
import { login, register, getMe, verifyOtp, resendOtp, forgetPassword, resetPassword, logout, checkAutoVerify as checkAutoVerifyApi, verifyEmailLink } from "../services/auth.api";

export const useAuth = () => {
  const dispatch = useDispatch();

  const registerUser = async (username, email, password) => {
    try {
      dispatch(setLoading(true));
      const user = await register(username, email, password);
      dispatch(setUser(user));
      dispatch(setLoading(false));
      return user; // Return user on success
    } catch (error) {
      dispatch(setError(error.message || "Registration failed"));
      dispatch(setLoading(false));
      throw error; // Re-throw the error
    } finally {
      dispatch(setLoading(false));
    }
  };

  const loginUser = async (email, password) => {
    try {
      dispatch(setLoading(true));
      const user = await login(email, password);
      dispatch(setUser(user));
      dispatch(setLoading(false));
      return user; // Return user on success
    } catch (err) {
      dispatch(setError(err.message || "Login failed"));
      dispatch(setLoading(false));
      throw err; // Re-throw the error so calling code can handle it
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchCurrentUser = async () => {
    try {
      dispatch(setLoading(true));
      const user = await getMe();
      dispatch(setUser(user));
      dispatch(setLoading(false));
      return user; // Return user on success
    } catch (error) {
      dispatch(setError(error.message || "Failed to fetch user"));
      dispatch(setLoading(false));
      throw error; // Re-throw the error
    } finally {
      dispatch(setLoading(false));
    }
  };

  const verifyUserOtp = async (email, otp) => {
    try {
      dispatch(setLoading(true));
      const user = await verifyOtp(email, otp);
      // The backend returns an updated user payload with verified: true
      dispatch(setUser(user)); 
      dispatch(setLoading(false));
      return user;
    } catch (error) {
      dispatch(setError(error.message || "Verification failed"));
      dispatch(setLoading(false));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const resendUserOtp = async (email) => {
    try {
      dispatch(setLoading(true));
      const response = await resendOtp(email);
      dispatch(setLoading(false));
      return response;
    } catch (error) {
      dispatch(setError(error.message || "Failed to resend OTP"));
      dispatch(setLoading(false));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const forgetUserPassword = async (email) => {
    try {
      dispatch(setLoading(true));
      const response = await forgetPassword(email);
      dispatch(setLoading(false));
      return response;
    } catch (error) {
      dispatch(setError(error.message || "Failed to send reset link"));
      dispatch(setLoading(false));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const resetUserPassword = async (email, otp, password) => {
    try {
      dispatch(setLoading(true));
      const response = await resetPassword(email, otp, password);
      dispatch(setLoading(false));
      return response;
    } catch (error) {
      dispatch(setError(error.message || "Failed to reset password"));
      dispatch(setLoading(false));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logoutUser = async () => {
    try {
      dispatch(setLoading(true));
      await logout().catch(() => {}); // Swallow 404s cleanly
    } catch (error) {
      dispatch(setError(error.message || "Failed to logout"));
    } finally {
      dispatch(setUser(null)); 
      dispatch(setLoading(false));
    }
  };

  const checkUserAutoVerify = async (email) => {
    try {
      const response = await checkAutoVerifyApi(email);
      return true;
    } catch (error) {
      return false;
    }
  };

  const verifyDirectEmailLink = async (token) => {
    try {
      dispatch(setLoading(true));
      const response = await verifyEmailLink(token);
      dispatch(setLoading(false));
      return response;
    } catch (error) {
      dispatch(setError(error.message || "Failed to verify email link"));
      dispatch(setLoading(false));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { 
    registerUser,   
    loginUser, 
    fetchCurrentUser, 
    verifyUserOtp, 
    resendUserOtp, 
    resetUserPassword,
    logoutUser,
    checkUserAutoVerify,
    verifyDirectEmailLink
  };
};
