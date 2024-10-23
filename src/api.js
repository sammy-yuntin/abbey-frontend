import axios from "axios";

// Base URL of the backend
const API_URL = "https://abbey-r84a.onrender.com/api"; // Update with your backend URL

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error.response.data);
    throw error.response.data;
  }
};

// Login User
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response.data);
    throw error.response.data;
  }
};
