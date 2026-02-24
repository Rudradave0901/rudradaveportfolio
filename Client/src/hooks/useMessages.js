import { useState, useEffect, useCallback } from 'react';
import axiosInstance from "../api/axiosInstance";
import { useGlobalLoading } from "../context/LoadingContext";

const useMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useGlobalLoading();
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalPages: 0,
        total: 0
    });

    const fetchMessages = useCallback(async (page = 1, limit = 10) => {
        setLoading(true);
        startLoading('messages');
        try {
            const response = await axiosInstance.get(
                `/messages?page=${page}&limit=${limit}`
            );
            if (response.data.success) {
                setMessages(response.data.data);
                if (response.data.pagination) {
                    setPagination({
                        ...response.data.pagination,
                        total: response.data.total
                    });
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch messages');
        } finally {
            setLoading(false);
            stopLoading('messages');
        }
    }, [startLoading, stopLoading]);

    const deleteMessage = async (id) => {
        try {
            const response = await axiosInstance.delete(`/messages/${id}`);
            if (response.data.success) {
                // If we delete the last message on a page, fetch previous page or refresh
                if (messages.length === 1 && pagination.page > 1) {
                    fetchMessages(pagination.page - 1, pagination.limit);
                } else {
                    fetchMessages(pagination.page, pagination.limit);
                }
                return { success: true };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to delete message' };
        }
    };

    const markAsRead = async (id) => {
        try {
            const response = await axiosInstance.put(`/messages/${id}`, { isRead: true });
            if (response.data.success) {
                setMessages(messages.map(msg => msg._id === id ? { ...msg, isRead: true } : msg));
                return { success: true };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to update message' };
        }
    };

    useEffect(() => {
        fetchMessages(pagination.page, pagination.limit);
    }, [pagination.page, fetchMessages]);

    return {
        messages,
        loading,
        error,
        pagination,
        setPage: (page) => setPagination(prev => ({ ...prev, page })),
        deleteMessage,
        markAsRead,
        refresh: () => fetchMessages(pagination.page, pagination.limit)
    };
};

export default useMessages;
