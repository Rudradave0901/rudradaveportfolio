import React, { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Sidebar from '../components/portfolio/Sidebar';
import ProjectList from '../components/portfolio/ProjectList';
import useProjects from '../hooks/useProjects';

gsap.registerPlugin(useGSAP);

const CATEGORIES = ['All', 'UI designs', 'React Projects', 'Full stack Projects'];

const ProjectsPage = () => {
    const { projects, loading: hookLoading, error: hookError } = useProjects();
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const containerRef = useRef(null);

    useEffect(() => {
        if (!hookLoading && projects) {
            if (selectedCategory === 'All') {
                setFilteredProjects(projects);
            } else {
                setFilteredProjects(projects.filter(p => p.category === selectedCategory));
            }
        }
    }, [selectedCategory, projects, hookLoading]);

    useGSAP(() => {
        if (!hookLoading) {
            gsap.from(".project-card", {
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
            });
        }
    }, { dependencies: [hookLoading, selectedCategory], scope: containerRef });

    return (
        <div className="bg-zinc-950 flex flex-col min-h-screen">

            <div className="flex flex-1" ref={containerRef}>
                {/* Sidebar */}
                <Sidebar
                    categories={CATEGORIES}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    isOpen={isSidebarOpen}
                    setIsOpen={setIsSidebarOpen}
                />

                {/* Main Content Area */}
                <main className="flex-1 lg:ml-72 min-h-screen">
                    {/* Top Header Section */}
                    <header className="p-6 lg:p-10 flex items-center justify-between sticky top-0 bg-zinc-950/80 backdrop-blur-md z-30">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-xl bg-zinc-900 shadow-sm border border-zinc-800 text-zinc-400 hover:text-white"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                                    Featured Projects
                                </h1>
                                <p className="text-zinc-500 text-sm mt-1">
                                    Explore a collection of my best work and side projects.
                                </p>
                            </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-sky-500/10 text-sky-400 rounded-full border border-sky-500/20">
                            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                            <span className="text-sm font-semibold">{filteredProjects.length} Projects Found</span>
                        </div>
                    </header>

                    {/* Content Section */}
                    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto">
                        {/* Active Category Display (Mobile Only) */}
                        <div className="lg:hidden mb-8">
                            <div className="inline-block px-4 py-1 bg-sky-500/10 text-sky-400 rounded-lg text-sm font-bold border border-sky-500/20">
                                Category: {selectedCategory}
                            </div>
                        </div>

                        {hookError ? (
                            <div className="text-center py-20 text-red-500">{hookError}</div>
                        ) : (
                            <ProjectList projects={filteredProjects} isLoading={hookLoading} />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProjectsPage;
