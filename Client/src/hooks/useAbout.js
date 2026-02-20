import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";

const useAbout = (fetchOnMount = true) => {
    const [aboutData, setAboutData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAboutData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get("/about");

            if (!response.data?.data) {
                setAboutData(null);
                return;
            }

            setAboutData(response.data.data);
        } catch (err) {
            if (err.response?.status !== 404) {
                setError(err.response?.data?.message || "Failed to fetch about data");
            }
            setAboutData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const createAbout = async (data) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post("/about", data);
            await fetchAboutData();
            return { success: true, message: response.data.message };
        } catch (err) {
            const message = err.response?.data?.message || "Failed to create about data";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const updateAbout = async (data) => {
        setLoading(true);
        try {
            const response = await axiosInstance.put("/about", data);
            await fetchAboutData();
            return { success: true, message: response.data.message };
        } catch (err) {
            const message = err.response?.data?.message || "Failed to update about data";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const deleteAbout = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.delete("/about");
            setAboutData(null);
            return { success: true, message: response.data.message };
        } catch (err) {
            const message = err.response?.data?.message || "Failed to delete about data";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (fetchOnMount) {
            fetchAboutData();
        }
    }, [fetchOnMount, fetchAboutData]);

    return {
        aboutData,
        loading,
        error,
        fetchAboutData,
        createAbout,
        updateAbout,
        deleteAbout,
    };
};

export default useAbout;
