import axiosWrapper from "@/utils/api";
import API_URLS from "../API_URLS";

const registerAPI = async (postData: any) => {
  try {
    return await axiosWrapper("post", API_URLS.AUTH.SIGNUP, postData);
  } catch (error) {
    throw error;
  }
};

const loginAPI = async (postData: any) => {
  try {
    return await axiosWrapper("post", API_URLS.AUTH.LOGIN, postData);
  } catch (error) {
    throw error;
  }
};

const logoutAPI = async () => {
  try {
    return await axiosWrapper("post", API_URLS.AUTH.LOGOUT);
  } catch (error) {
    throw error;
  }
};

const forgotPasswordAPI = async (postData: any) => {
  try {
    return await axiosWrapper("post", API_URLS.AUTH.FORGOT_PASSWORD, postData);
  } catch (error) {
    throw error;
  }
};

const resetPasswordAPI = async (postData: any) => {
  try {
    return await axiosWrapper("post", API_URLS.AUTH.RESET_PASSWORD, postData);
  } catch (error) {
    throw error;
  }
};

const verifyEmailAPI = async (postData: any) => {
  try {
    return await axiosWrapper("post", API_URLS.AUTH.VERIFY_EMAIL, postData);
  } catch (error) {
    throw error;
  }
};

const refreshTokenAPI = async (refreshToken: string) => {
  try {
    return await axiosWrapper("post", API_URLS.AUTH.REFRESH_TOKEN, { refreshToken });
  } catch (error) {
    throw error;
  }
};

const authServices = {
  register: registerAPI,
  login: loginAPI,
  logout: logoutAPI,
  forgotPassword: forgotPasswordAPI,
  resetPassword: resetPasswordAPI,
  verifyEmail: verifyEmailAPI,
  refreshToken: refreshTokenAPI,
};

export default authServices;
