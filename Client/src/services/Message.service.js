import axiosInstance from "../api/axiosInstance";

class MessageService {
    async getAllMessages() {
        const response = await axiosInstance.get("/messages");
        return response.data;
    }

    async submitMessage(data) {
        const response = await axiosInstance.post("/messages", data);
        return response.data;
    }

    async updateMessageStatus(id, data) {
        const response = await axiosInstance.put(`/messages/${id}`, data);
        return response.data;
    }

    async deleteMessage(id) {
        const response = await axiosInstance.delete(`/messages/${id}`);
        return response.data;
    }
}

export default new MessageService();
