import axiosInstance from "../api/axiosInstance";

class AuthService {
    async login(email, password) {
        const response = await axiosInstance.post("/auth/login", { email, password });
        return response.data;
    }

    async signup(userData) {
        const response = await axiosInstance.post("/auth/register", userData);
        return response.data;
    }

    async logout() {
        const response = await axiosInstance.get("/auth/logout");
        return response.data;
    }

    async getMe() {
        const response = await axiosInstance.get("/auth/me");
        return response.data;
    }
}

export default new AuthService();
