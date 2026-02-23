import axiosInstance from "../api/axiosInstance";

class EduExpService {
    async getAllEduExp() {
        const response = await axiosInstance.get("/eduExp");
        return response.data;
    }

    async createEduExp(data) {
        const response = await axiosInstance.post("/eduExp", data);
        return response.data;
    }

    async updateEduExp(id, data) {
        const response = await axiosInstance.put(`/eduExp/${id}`, data);
        return response.data;
    }

    async deleteEduExp(id) {
        const response = await axiosInstance.delete(`/eduExp/${id}`);
        return response.data;
    }
}

export default new EduExpService();
