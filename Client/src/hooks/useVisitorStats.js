import { useState, useEffect, useCallback } from 'react';
import axiosInstance from "../api/axiosInstance";
import { useGlobalLoading } from "../context/LoadingContext";

const useVisitorStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useGlobalLoading();
    const [error, setError] = useState(null);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        startLoading('visitor-stats');
        try {
            const response = await axiosInstance.get("/visitors/stats");
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch visitor stats');
        } finally {
            setLoading(false);
            stopLoading('visitor-stats');
        }
    }, [startLoading, stopLoading]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, loading, error, refresh: fetchStats };
};

export default useVisitorStats;
