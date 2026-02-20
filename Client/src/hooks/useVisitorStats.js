import { useState, useEffect } from 'react';
import axios from 'axios';

const useVisitorStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/visitors/stats`, { withCredentials: true });
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch visitor stats');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return { stats, loading, error, refresh: fetchStats };
};

export default useVisitorStats;
