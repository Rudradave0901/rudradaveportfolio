import { useGlobalLoading } from '../../context/LoadingContext';

const GlobalLoader = () => {
    const { isLoading } = useGlobalLoading();

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a]">
            <div className="relative">
                {/* Advanced Multi-Stage Loader */}
                <div className="w-24 h-24 rounded-full border-t-4 border-blue-500 animate-spin"></div>
                <div className="absolute inset-0 w-24 h-24 rounded-full border-r-4 border-purple-500 animate-spin transition-all duration-700 delay-150"></div>
                <div className="absolute inset-0 w-24 h-24 rounded-full border-b-4 border-cyan-500 animate-spin transition-all duration-1000 delay-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                </div>
            </div>

            <div className="mt-8 text-center animate-pulse">
                <h2 className="text-xl font-bold text-white tracking-widest uppercase mb-2">Initialising</h2>
                <div className="flex gap-1 justify-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                </div>
            </div>

            <p className="absolute bottom-10 text-white/20 text-[10px] uppercase tracking-[0.5em] font-medium">
                Digital Portfolio System v2.0
            </p>
        </div>
    );
};

export default GlobalLoader;
