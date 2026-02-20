import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";

const useResume = (fetchOnMount = true) => {
    const [resumeData, setResumeData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchResume = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get("/resume");

            if (!response.data?.data) {
                setResumeData(null);
                return;
            }

            setResumeData(response.data.data);
        } catch (err) {
            if (err.response?.status !== 404) {
                setError(err.response?.data?.message || "Failed to fetch resume data");
            }
            setResumeData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const createResume = async (data) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post("/resume", data);
            await fetchResume();
            return { success: true, message: response.data.message };
        } catch (err) {
            const message = err.response?.data?.message || "Failed to create resume";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const updateResume = async (data) => {
        setLoading(true);
        try {
            const response = await axiosInstance.put("/resume", data);
            setResumeData(response.data.data);
            return { success: true, message: response.data.message };
        } catch (err) {
            const message = err.response?.data?.message || "Failed to update resume";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const deleteResume = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.delete("/resume");
            setResumeData(null);
            return { success: true, message: response.data.message };
        } catch (err) {
            const message = err.response?.data?.message || "Failed to delete resume";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (fetchOnMount) {
            fetchResume();
        }
    }, [fetchOnMount, fetchResume]);

    return {
        resumeData,
        loading,
        error,
        fetchResume,
        createResume,
        updateResume,
        deleteResume,
        setResumeData, // Exposed for local state management in admin forms
    };
};

export default useResume;
