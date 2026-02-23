import axiosInstance from "../api/axiosInstance";

class ResumeService {
    async getResumeData() {
        const response = await axiosInstance.get("/resume");
        return response.data;
    }

    async createResume(data) {
        const response = await axiosInstance.post("/resume", data);
        return response.data;
    }

    async updateResume(data) {
        const response = await axiosInstance.put("/resume", data);
        return response.data;
    }
}

export default new ResumeService();
