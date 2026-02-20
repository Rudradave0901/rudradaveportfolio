import { useState, useEffect } from 'react';
import axios from 'axios';

const useMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/messages`, { withCredentials: true });
            if (response.data.success) {
                setMessages(response.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch messages');
        } finally {
            setLoading(false);
        }
    };

    const deleteMessage = async (id) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/messages/${id}`, { withCredentials: true });
            if (response.data.success) {
                setMessages(messages.filter(msg => msg._id !== id));
                return { success: true };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to delete message' };
        }
    };

    const markAsRead = async (id) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/messages/${id}`, { isRead: true }, { withCredentials: true });
            if (response.data.success) {
                setMessages(messages.map(msg => msg._id === id ? { ...msg, isRead: true } : msg));
                return { success: true };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to update message' };
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    return { messages, loading, error, deleteMessage, markAsRead, refresh: fetchMessages };
};

export default useMessages;
