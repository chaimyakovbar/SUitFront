import axios from "axios";

const baseURL = "https://suitback.onrender.com"
// const baseURL = "http://localhost:3020";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // אם אתה עובד עם קוקיז
  headers: {
    "Content-Type": "application/json",
  },
});

// קבלת כל המשתמשים
export const getUsers = async () => {
  try {
    const response = await axiosInstance.get("/user")
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}
// יצירת משתמש חדש
export const postUsers = async (data) => await axiosInstance.post("/user", data)


// מחיקת משתמש לפי ID
export const deleteUsers = async (id) => {
  try {
    const response = await axiosInstance.delete(`/user/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// התחברות משתמש
export const loginUser = async (values) => {
  try {
    const response = await axiosInstance.post("/user/login", values, {
      withCredentials: true, // אם אתה עובד עם קוקיז
    });
    console.log("Login successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};

// רישום משתמש חדש
export const registerUser = async (values) => {
  try {
    const response = await axiosInstance.post("/user/register", values);
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error(error.response.data.message || "Email is already in use");
    }
    console.error("Error registering user:", error);
    throw error;
  }
}

// Update user data
export const updateUser = async (userId, data) => {
  try {
    const response = await axiosInstance.post("/user/update", {
      uid: userId,
      ...data
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("User not found");
    }
    console.error("Error updating user:", error);
    throw error;
  }
};