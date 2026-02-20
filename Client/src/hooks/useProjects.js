import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";

const useProjects = (fetchOnMount = true) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get("/projects");

      if (!response.data?.data) {
        setProjects([]);
        return;
      }

      setProjects(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProject = async (formData) => {
    setLoading(true);
    try {
      await axiosInstance.post("/projects", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchProjects();
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create project";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const editProject = async (id, formData) => {
    setLoading(true);
    try {
      await axiosInstance.put(`/projects/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchProjects();
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update project";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const removeProject = async (id) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/projects/${id}`);
      await fetchProjects();
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete project";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchOnMount) {
      fetchProjects();
    }
  }, [fetchOnMount, fetchProjects]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    addProject,
    editProject,
    removeProject,
  };
};

export default useProjects;
