import { useState, useEffect, useCallback } from "react";
import BannerService from "../services/Banner.service";

const useBanner = (fetchOnMount = true) => {
    const [bannerData, setBannerData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBannerData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await BannerService.getBannerData();

            if (!data?.data) {
                setBannerData(null);
                return;
            }

            setBannerData(data.data);
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
            const data = await BannerService.createBanner(formData);
            await fetchBannerData();
            return { success: true, message: data.message };
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
            const data = await BannerService.updateBanner(formData);
            await fetchBannerData();
            return { success: true, message: data.message };
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
            const data = await BannerService.deleteBanner();
            setBannerData(null);
            return { success: true, message: data.message };
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
