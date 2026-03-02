import React from 'react';
import ProjectCard from './ProjectCard';

const ProjectList = ({ projects, isLoading }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-zinc-900 h-[450px] rounded-2xl animate-pulse border border-zinc-800" />
                ))}
            </div>
        );
    }

    if (!projects || projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-24 h-24 bg-zinc-900 rounded-3xl flex items-center justify-center mb-8 border border-zinc-800 shadow-xl">
                    <svg className="w-12 h-12 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">No projects found</h3>
                <p className="text-zinc-500 max-w-sm leading-relaxed">
                    We couldn't find any projects matching this category in your portfolio.
                    Try browsing all projects or check back later.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-8 px-6 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 rounded-xl transition-all text-sm font-medium"
                >
                    Refresh Projects
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-20">
            {projects.map((project) => (
                <ProjectCard key={project._id || project.id} project={project} />
            ))}
        </div>
    );
};

export default ProjectList;
