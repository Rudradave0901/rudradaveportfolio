import React from 'react';

const Sidebar = ({ categories, selectedCategory, onSelectCategory, isOpen, setIsOpen }) => {
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Panel */}
            <aside className={`
        fixed top-0 left-0 h-full bg-zinc-900 border-r border-zinc-800
        w-72 z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="flex flex-col h-full p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Portfolio
                        </h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Categories */}
                    <nav className="space-y-2">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">
                            Project Categories
                        </p>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => {
                                    onSelectCategory(category);
                                    if (window.innerWidth < 1024) setIsOpen(false);
                                }}
                                className={`
                  w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200
                  ${selectedCategory === category
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600'}
                `}
                            >
                                <span className="font-medium">{category}</span>
                                {selectedCategory === category && (
                                    <svg className="w-5 h-5 ml-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* Footer/Contact Info */}
                    <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3 px-2 text-slate-500">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-medium">Available for hire</span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
