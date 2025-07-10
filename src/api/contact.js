const baseURL = "https://suitback.onrender.com"
// const baseURL = "http://localhost:3020";

export const sendContactMessage = async (formData) => {
    try {
        const response = await fetch(`${baseURL}/contact/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error sending contact message:", error);
        throw error;
    }
}; 