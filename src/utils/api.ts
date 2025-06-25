import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

const axiosWrapper = async (method: string, url: string, data: any = null) => {
  try {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
      method,
      url,
      headers,
      data,
    };

    const response = await instance(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default axiosWrapper;
