import axios from "axios"

const baseURL = "https://suitback.onrender.com"
// const baseURL = "http://localhost:3020"

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true, // אם אתה עובד עם קוקיז
    headers: {
        "Content-Type": "application/json",
    },
});

export const postProduct = async ({ email, sizes }) => {
    return axiosInstance.post("/product", { email, sizes });
};

export const postSuitProduct = async ({ email, allSuitPart }) => {
    return axiosInstance.post("/product/suits", {
        email,
        allSuitPart,
    });
};

export const getAllProducts = async () => {
    return axiosInstance.get("/product");
};



