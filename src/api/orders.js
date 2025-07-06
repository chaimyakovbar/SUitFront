import axios from "axios";

// const baseURL = "https://suitback.onrender.com"
const baseURL = "http://localhost:3020";

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Save order data to database (excluding payment info)
export const saveOrder = async (orderData) => {
    try {
        const response = await axiosInstance.post("/orders", orderData);
        return response.data;
    } catch (error) {
        console.error("Error saving order:", error);
        throw error;
    }
};

// Get user orders
export const getUserOrders = async (userId) => {
    try {
        const response = await axiosInstance.get(`/orders/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user orders:", error);
        // Fallback to localStorage
        const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        return { orders: localOrders.filter(order => order.userId === userId) };
    }
};

// Get order by ID
export const getOrderById = async (orderId) => {
    try {
        const response = await axiosInstance.get(`/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching order:", error);
        // Fallback to localStorage
        const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const order = localOrders.find(order => order.id === orderId || order.paymentId === orderId);
        return order ? { order } : null;
    }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await axiosInstance.patch(`/orders/${orderId}`, { status });
        return response.data;
    } catch (error) {
        console.error("Error updating order status:", error);
        // Fallback to localStorage
        const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const orderIndex = localOrders.findIndex(order => order.id === orderId || order.paymentId === orderId);
        if (orderIndex !== -1) {
            localOrders[orderIndex].paymentStatus = status;
            localStorage.setItem('orders', JSON.stringify(localOrders));
            return { success: true, message: 'Order status updated locally' };
        }
        throw error;
    }
};

// Get all local orders (for debugging)
export const getLocalOrders = () => {
    try {
        return JSON.parse(localStorage.getItem('orders') || '[]');
    } catch (error) {
        console.error("Error reading local orders:", error);
        return [];
    }
};

// Clear local orders (for testing)
export const clearLocalOrders = () => {
    localStorage.removeItem('orders');
};

// Remove purchased suits from database
export const removePurchasedSuits = async (orderId, suitIds) => {
    try {
        const response = await axiosInstance.post(`/orders/${orderId}/remove-suits`, {
            suitIds: suitIds
        });
        return response.data;
    } catch (error) {
        console.error("Error removing purchased suits:", error);
        throw error;
    }
}; 