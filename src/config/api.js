import axios from "axios";

// API Configuration - Switch between local and remote servers
// Choose your preferred server
const USE_LOCAL = false; // Set to false to use remote server

const baseURL = USE_LOCAL
    ? "http://localhost:3020"
    : "https://suitback.onrender.com";

// Create axios instance with proper configuration
const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('Response error:', {
            status: error.response?.status,
            data: error.response?.data,
            config: error.config
        });
        return Promise.reject(error);
    }
);

// API endpoints
export const API_ENDPOINTS = {
    // Text Inside
    TEXT_INSIDE: `${baseURL}/textInside`,

    // Suit Management
    SUIT_PRODUCT: `${baseURL}/suitProduct`,
    POST_SUIT: `${baseURL}/product/suits`,

    // User Management
    USER: `${baseURL}/user`,
    REGISTER: `${baseURL}/register`,
    LOGIN: `${baseURL}/login`,
    AUTH_WEBHOOK: `${baseURL}/auth-webhook`,

    // Orders
    ORDERS: `${baseURL}/orders`,
    CREATE_ORDER_PENDING: `${baseURL}/payments/create-order-pending`,

    // Contact
    CONTACT: `${baseURL}/contact`,

    // Sizes
    SIZES: `${baseURL}/product`,
};

// Helper function to get full URL for any endpoint
export const getApiUrl = (endpoint) => {
    return `${baseURL}${endpoint}`;
};

// User API Functions
export const userAPI = {
    // Get all users
    getUsers: async () => {
        try {
            const response = await axiosInstance.get("/user");
            return response.data;
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    },

    // Create new user
    postUsers: async (data) => {
        try {
            const response = await axiosInstance.post("/user", data);
            return response.data;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

    // Delete user by ID
    deleteUsers: async (id) => {
        try {
            const response = await axiosInstance.delete(`/user/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    },

    // User login
    loginUser: async (values) => {
        try {
            const response = await axiosInstance.post("/user/login", values, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            throw error;
        }
    },

    // User registration
    registerUser: async (values) => {
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
    },

    // Update user data
    updateUser: async (email, data) => {
        try {
            const response = await axiosInstance.post("/user/update", {
                email: email,
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
    },

    // Authentication webhook
    authWebhook: async (userData) => {
        try {
            const response = await axiosInstance.post('/user/auth-webhook', userData);
            return response.data;
        } catch (error) {
            console.error('Auth webhook error:', error);
            throw error;
        }
    },

    // Create user
    createUser: async (userData) => {
        try {
            const response = await axiosInstance.post('/user/create', userData);
            return response.data;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },

    // Password reset
    resetPassword: async (email) => {
        try {
            const response = await axiosInstance.post('/email/password-reset', { email });
            return response.data;
        } catch (error) {
            console.error('Password reset error:', error);

            // Translate server errors to English
            let errorMessage = "Error sending password reset email";

            if (error.response?.status === 400) {
                errorMessage = error.response.data?.message || "Invalid email address";
            } else if (error.response?.status === 500) {
                errorMessage = "Server error. Please try again later";
            } else if (error.code === 'ERR_NETWORK') {
                errorMessage = "Internet connection problem";
            }

            const translatedError = new Error(errorMessage);
            translatedError.originalError = error;
            throw translatedError;
        }
    }
};

// Log current configuration

export { axiosInstance, baseURL };
export default baseURL; 