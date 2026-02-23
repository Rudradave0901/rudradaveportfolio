import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";

/**
 * Custom hook to manage education and experience data.
 * @param {boolean} [fetchOnMount=true] - Whether to fetch data when the hook mounts.
 * @returns {Object} State and methods for handling education/experience data.
 */
const useEduExp = (fetchOnMount = true) => {
    const [eduExpData, setEduExpData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchEduExp = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get("/eduExp");

            if (!response.data?.data) {
                setEduExpData([]);
                return;
            }

            setEduExpData(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch education/experience data");
            setEduExpData([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const addEduExp = async (data) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post("/eduExp", data);
            await fetchEduExp();
            return { success: true, message: response.data.message };
        } catch (err) {
            const message = err.response?.data?.message || "Failed to create record";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Edits an existing education or experience record in the backend.
     * After successful update, it refetches all data.
     * @param {string} id - The ID of the record to edit.
     * @param {Object} data - The updated education or experience data.
     * @returns {Promise<{success: boolean, message: string}>} An object indicating success and a message.
     */
    const editEduExp = async (id, data) => {
        setLoading(true);
        try {
            const response = await axiosInstance.put(`/eduExp/${id}`, data);
            await fetchEduExp();
            return { success: true, message: response.data.message };
        } catch (err) {
            const message = err.response?.data?.message || "Failed to update record";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const removeEduExp = async (id) => {
        setLoading(true);
        try {
            const response = await axiosInstance.delete(`/eduExp/${id}`);
            await fetchEduExp();
            return { success: true, message: response.data.message };
        } catch (err) {
            const message = err.response?.data?.message || "Failed to delete record";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (fetchOnMount) {
            fetchEduExp();
        }
    }, [fetchOnMount, fetchEduExp]);

    return {
        eduExpData,
        loading,
        error,
        fetchEduExp,
        addEduExp,
        editEduExp,
        removeEduExp,
    };
};

export default useEduExp;
