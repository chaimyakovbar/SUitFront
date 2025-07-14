import { userAPI } from '../config/api.js';

// קבלת כל המשתמשים
export const getUsers = userAPI.getUsers;

// יצירת משתמש חדש
export const postUsers = userAPI.postUsers;

// מחיקת משתמש לפי ID
export const deleteUsers = userAPI.deleteUsers;

// התחברות משתמש
export const loginUser = userAPI.loginUser;

// רישום משתמש חדש
export const registerUser = userAPI.registerUser;

// Update user data
export const updateUser = userAPI.updateUser;