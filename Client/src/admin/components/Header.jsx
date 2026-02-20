import React from 'react'

const Header = () => {
  return (
    <>
        {/* <!-- Header (Search Bar Removed) --> */}
        <header className="flex items-center justify-between mb-10 glass-header sticky top-0 py-4">
            <div>
                <h1 id="page-title" className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-gray-400">Welcome back, Rudra!</p>
            </div>
            <div className="flex items-center gap-4">
                <button onclick="toggleMobileSidebar()" className="md:hidden text-white p-2">
                    <i className="fas fa-bars"></i>
                </button>
                <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:border-cyan-500 transition-colors">
                    <i className="fas fa-bell text-sm"></i>
                </button>
            </div>
        </header>
    </>
  )
}

export default Header