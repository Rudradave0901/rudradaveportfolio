import React from "react";

const LoadingSkeleton = ({ count = 6, className = "bg-zinc-900/50 rounded-2xl h-32 animate-pulse border border-zinc-800" }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className={className} />
            ))}
        </div>
    );
};

export default LoadingSkeleton;
