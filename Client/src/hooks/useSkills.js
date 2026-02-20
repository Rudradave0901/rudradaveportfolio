import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";

const useSkills = (fetchOnMount = true) => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSkills = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get("/skills");

            if (!response.data?.data) {
                setSkills([]);
                return;
            }

            setSkills(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch skills");
            setSkills([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const addSkill = async (formData) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post("/skills", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            await fetchSkills();
            return { success: true, message: response.data.message };
        } catch (err) {
            const message = err.response?.data?.message || "Failed to create skill";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const editSkill = async (id, formData) => {
        setLoading(true);
        try {
            const response = await axiosInstance.put(`/skills/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            await fetchSkills();
            return { success: true, message: response.data.message };
        } catch (err) {
            const message = err.response?.data?.message || "Failed to update skill";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const removeSkill = async (id) => {
        setLoading(true);
        try {
            const response = await axiosInstance.delete(`/skills/${id}`);
            await fetchSkills();
            return { success: true, message: response.data.message };
        } catch (err) {
            const message = err.response?.data?.message || "Failed to delete skill";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (fetchOnMount) {
            fetchSkills();
        }
    }, [fetchOnMount, fetchSkills]);

    return {
        skills,
        loading,
        error,
        fetchSkills,
        addSkill,
        editSkill,
        removeSkill,
    };
};

export default useSkills;
