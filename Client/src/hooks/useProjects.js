import { useState, useEffect, useCallback } from "react";
import ProjectService from "../services/Project.service";
import { useGlobalLoading } from "../context/LoadingContext";

const useProjects = (fetchOnMount = true) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const { startLoading, stopLoading } = useGlobalLoading();
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    startLoading('projects');
    setError(null);

    try {
      const data = await ProjectService.getAllProjects();

      if (!data?.data) {
        setProjects([]);
        return;
      }

      setProjects(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch projects");
      setProjects([]);
    } finally {
      setLoading(false);
      stopLoading('projects');
    }
  }, [startLoading, stopLoading]);

  const addProject = async (formData) => {
    setLoading(true);
    try {
      await ProjectService.createProject(formData);
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
      await ProjectService.updateProject(id, formData);
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
      await ProjectService.deleteProject(id);
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
