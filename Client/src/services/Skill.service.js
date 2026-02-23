import axiosInstance from "../api/axiosInstance";

class SkillService {
    async getAllSkills() {
        const response = await axiosInstance.get("/skills");
        return response.data;
    }

    async createSkill(formData) {
        const response = await axiosInstance.post("/skills", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    }

    async updateSkill(id, formData) {
        const response = await axiosInstance.put(`/skills/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    }

    async deleteSkill(id) {
        const response = await axiosInstance.delete(`/skills/${id}`);
        return response.data;
    }
}

export default new SkillService();
