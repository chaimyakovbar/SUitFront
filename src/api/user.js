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

// Delete size profile
export const deleteSizeProfile = async (email, profileName) => {
    try {
        const response = await fetch(`http://localhost:3020/product/profile`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, profileName }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete profile');
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting profile:', error);
        throw error;
    }
};