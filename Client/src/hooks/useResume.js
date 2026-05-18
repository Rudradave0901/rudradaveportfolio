import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";

const useResume = (fetchOnMount = true, initialId = null) => {
    const [resumeData, setResumeData] = useState(null);
    const [resumesList, setResumesList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchResumesList = useCallback(async () => {
        try {
            const response = await axiosInstance.get("/resume/all");
            if (response.data?.data) {
                setResumesList(response.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch resumes list:", err);
        }
    }, []);

    const fetchResume = useCallback(async (id = null) => {
        setLoading(true);
        setError(null);

        try {
            const url = id ? `/resume?id=${id}` : "/resume";
            const response = await axiosInstance.get(url);

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
            setResumeData(response.data.data);
            await fetchResumesList();
            return { success: true, message: response.data.message, data: response.data.data };
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
            const response = await axiosInstance.put(`/resume/${data._id}`, data);
            setResumeData(response.data.data);
            await fetchResumesList();
            return { success: true, message: response.data.message };
        } catch (err) {
            const message = err.response?.data?.message || "Failed to update resume";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const deleteResume = async (id) => {
        setLoading(true);
        try {
            const response = await axiosInstance.delete(`/resume/${id}`);
            if (resumeData?._id === id) {
                setResumeData(null);
            }
            await fetchResumesList();
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
            fetchResume(initialId);
            fetchResumesList();
        }
    }, [fetchOnMount, fetchResume, fetchResumesList, initialId]);

    return {
        resumeData,
        resumesList,
        loading,
        error,
        fetchResume,
        fetchResumesList,
        createResume,
        updateResume,
        deleteResume,
        setResumeData, // Exposed for local state management in admin forms
    };
};

export default useResume;
