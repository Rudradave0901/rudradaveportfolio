import React from 'react'
import { useAuth } from '../../context/AuthContext'

const Header = () => {
    const { user } = useAuth();

    return (
        <>
            {/* <!-- Header (Search Bar Removed) --> */}
            <header className="flex items-center justify-between mb-10 glass-header sticky top-0 py-4 z-50">
                <div>
                    <h1 id="page-title" className="text-2xl font-bold">Admin Panel</h1>
                    <p className="text-sm text-gray-400 capitalize">
                        Welcome back, {user?.username || 'Rudra'}!
                        <span className={`ml-3 px-2 py-0.5 text-[10px] font-bold uppercase rounded-md ${user?.role === 'admin' ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}`}>
                            {user?.role || 'Viewer'}
                        </span>
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="md:hidden text-white p-2">
                        <i className="fas fa-bars"></i>
                    </button>
                    <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                            {(user?.username || 'R').charAt(0).toUpperCase()}
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-xs font-bold text-white leading-none mb-1">{user?.username || 'Rudra'}</p>
                            <p className="text-[10px] text-zinc-500 leading-none capitalize">{user?.role || 'Guest'}</p>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header