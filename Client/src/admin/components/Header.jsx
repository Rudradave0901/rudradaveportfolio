import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { isAdmin as checkIsAdmin } from '../../utils/authUtils'

const Header = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const isAdmin = checkIsAdmin(user);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <>
            {/* <!-- Header --> */}
            <header className="flex items-center justify-between mb-8 glass-header sticky top-0 py-4 z-40 bg-zinc-950/80 backdrop-blur-md rounded-2xl px-4 border border-white/5">
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <i className="fas fa-bars text-xl"></i>
                    </button>
                    <div>
                        <h1 id="page-title" className="text-xl md:text-2xl font-bold tracking-tight">Admin <span className="hidden sm:inline">Panel</span></h1>
                        <p className="text-[10px] md:text-sm text-gray-400 capitalize hidden xs:block">
                            {user?.username || 'Rudra'}
                            <span className={`ml-2 px-1.5 py-0.5 text-[8px] md:text-[10px] font-bold uppercase rounded-md ${isAdmin ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}`}>
                                {user?.role || 'Viewer'}
                            </span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                    <button
                        onClick={handleLogout}
                        className="p-2 md:px-4 md:py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center gap-2 border border-red-500/20"
                    >
                        <span className="material-symbols-rounded text-lg">logout</span>
                        <span className="hidden sm:inline">Logout</span>
                    </button>

                    <div className="flex items-center gap-2 md:gap-3 px-2 md:px-4 py-1.5 md:py-2 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-[10px] md:text-xs font-bold text-white shadow-lg">
                            {(user?.username || 'R').charAt(0).toUpperCase()}
                        </div>
                        <div className="hidden lg:block text-left">
                            <p className="text-[10px] md:text-xs font-bold text-white leading-none mb-1 truncate max-w-[80px]">{user?.username || 'Rudra'}</p>
                            <p className="text-[8px] md:text-[10px] text-zinc-500 leading-none capitalize">{user?.role || 'Guest'}</p>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header