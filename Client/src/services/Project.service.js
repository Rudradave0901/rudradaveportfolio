import axiosInstance from "../api/axiosInstance";

/**
 * Service class for handling project-related API calls.
 */
class ProjectService {
    /**
     * Fetches all projects from the server.
     * @returns {Promise<Object>} API response data.
     */
    async getAllProjects() {
        const response = await axiosInstance.get("/projects");
        return response.data;
    }

    /**
     * Creates a new project.
     * @param {FormData} formData - The project data, including images.
     * @returns {Promise<Object>} API response data.
     */
    async createProject(formData) {
        const response = await axiosInstance.post("/projects", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    }

    /**
     * Updates an existing project.
     * @param {string} id - The project ID to update.
     * @param {FormData} formData - The updated project data.
     * @returns {Promise<Object>} API response data.
     */
    async updateProject(id, formData) {
        const response = await axiosInstance.put(`/projects/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    }

    /**
     * Deletes a project by ID.
     * @param {string} id - The project ID to delete.
     * @returns {Promise<Object>} API response data.
     */
    async deleteProject(id) {
        const response = await axiosInstance.delete(`/projects/${id}`);
        return response.data;
    }
}

export default new ProjectService();
