import { axiosInstance } from "../config/api.js";

export const sendContactMessage = async (messageData) => {
    try {
        const response = await axiosInstance.post("/contact", messageData);
        return response.data;
    } catch (error) {
        console.error("Error sending contact message:", error);
        throw error;
    }
}; 