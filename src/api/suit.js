import { axiosInstance } from "../config/api.js"

export const postProduct = async ({ email, sizes, sizesTable }) => {
    return axiosInstance.post("/product", { email, sizes, sizesTable });
};

export const postSuitProduct = async ({ email, allSuitPart }) => {
    const response = await axiosInstance.post("/product/suits", {
        email,
        allSuitPart,
    });
    return response.data; // This will include the suits with their IDs
};

export const getAllProducts = async (email) => {
    return axiosInstance.get(`/product?email=${email}`);
};

export const deleteSuit = async (suitId) => {
    return axiosInstance.delete(`/product/suits/${suitId}`, {
        params: {
            email: localStorage.getItem('email')
        }
    });
};



