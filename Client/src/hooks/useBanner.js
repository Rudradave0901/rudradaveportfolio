import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";

const useBanner = (fetchOnMount = true) => {
    const [bannerData, setBannerData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBannerData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get("/banners");

            if (!response.data?.data) {
                setBannerData(null);
                return;
            }

            setBannerData(response.data.data);
        } catch (err) {
            if (err.response?.status !== 404) {
                setError(err.response?.data?.message || "Failed to fetch banner data");
            }
            setBannerData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const createBanner = async (formData) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post("/banners", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            await fetchBannerData();
            return { success: true, message: response.data.message };
        } catch (err) {
            const message = err.response?.data?.message || "Failed to create banner";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const updateBanner = async (formData) => {
        setLoading(true);
        try {
            const response = await axiosInstance.put("/banners", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            await fetchBannerData();
            return { success: true, message: response.data.message };
        } catch (err) {
            const message = err.response?.data?.message || "Failed to update banner";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const deleteBanner = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.delete("/banners");
            setBannerData(null);
            return { success: true, message: response.data.message };
        } catch (err) {
            const message = err.response?.data?.message || "Failed to delete banner";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (fetchOnMount) {
            fetchBannerData();
        }
    }, [fetchOnMount, fetchBannerData]);

    return {
        bannerData,
        loading,
        error,
        fetchBannerData,
        createBanner,
        updateBanner,
        deleteBanner,
    };
};

export default useBanner;
