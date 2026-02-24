import { createContext, useState, useEffect, useContext } from "react";
import AuthService from "../services/Auth.service";
import { useGlobalLoading } from "./LoadingContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const { startLoading, stopLoading } = useGlobalLoading();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initAuth = async () => {
            startLoading('auth-check');
            await checkUserLoggedIn();
            stopLoading('auth-check');
        };
        initAuth();

        const handleUnauthorized = () => {
            setUser(null);
        };

        window.addEventListener('unauthorized', handleUnauthorized);
        return () => window.removeEventListener('unauthorized', handleUnauthorized);
    }, [startLoading, stopLoading]);

    const checkUserLoggedIn = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const data = await AuthService.getMe();
            setUser(data.data);
        } catch (err) {
            setUser(null);
            // Optionally remove invalid token
            localStorage.removeItem("token");
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            const data = await AuthService.signup(userData);
            setUser(data.data);
            if (data.data.token) localStorage.setItem("token", data.data.token);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
            throw err;
        }
    };

    const login = async (userData) => {
        try {
            setError(null);
            const data = await AuthService.login(userData.email, userData.password);
            setUser(data.data);
            if (data.data.token) localStorage.setItem("token", data.data.token);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
            throw err;
        }
    };

    const logout = async () => {
        try {
            await AuthService.logout();
            setUser(null);
            localStorage.removeItem("token");
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, register, login, logout, checkUserLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
