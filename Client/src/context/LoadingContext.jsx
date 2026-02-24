import { createContext, useState, useContext, useCallback } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [loadingTasks, setLoadingTasks] = useState(new Set());

    const startLoading = useCallback((taskName) => {
        setLoadingTasks((prev) => {
            const newTasks = new Set(prev);
            newTasks.add(taskName);
            return newTasks;
        });
    }, []);

    const stopLoading = useCallback((taskName) => {
        setLoadingTasks((prev) => {
            const newTasks = new Set(prev);
            newTasks.delete(taskName);
            return newTasks;
        });
    }, []);

    const isLoading = loadingTasks.size > 0;

    return (
        <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading, loadingTasks }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useGlobalLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useGlobalLoading must be used within a LoadingProvider');
    }
    return context;
};
