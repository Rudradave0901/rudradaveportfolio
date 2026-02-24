import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Aside = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();

  const linkClass = ({ isActive }) =>
    `sidebar-link flex items-center gap-3 px-4 py-3 rounded-lg transition
     ${isActive ? "active" : "hover:bg-white/5"}`;

  return (
    <>
      {/* <!-- Sidebar --> */}
      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 w-64 sidebar z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="p-6 h-full relative flex flex-col">
          {/* Close button for mobile */}
          <button
            onClick={toggleSidebar}
            className="md:hidden absolute top-6 right-6 text-zinc-400 hover:text-white"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
          {/* LOGO */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-full bg-[#00AEEF] flex items-center justify-center">
              <i className="fas fa-atom text-white text-lg"></i>
            </div>
            <span className="text-xl font-bold tracking-tight">
              Rudra<span className="text-[#00AEEF]">.</span>Admin
            </span>
          </div>

          {/* NAV */}
          <nav className="space-y-1 flex-1 overflow-y-auto custom-scrollbar pr-2">
            <NavLink to="/admin" end className={linkClass}>
              <i className="fas fa-chart-line w-5"></i>
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/admin/banner" className={linkClass}>
              <i className="fas fa-image w-5"></i>
              <span>Banner</span>
            </NavLink>

            <NavLink to="/admin/about" className={linkClass}>
              <i className="fas fa-user w-5"></i>
              <span>About Me</span>
            </NavLink>

            <NavLink to="/admin/projects" className={linkClass}>
              <i className="fas fa-briefcase w-5"></i>
              <span>Projects</span>
            </NavLink>

            <NavLink to="/admin/skills" className={linkClass}>
              <i className="fas fa-tools w-5"></i>
              <span>Skills & Tools</span>
            </NavLink>

            <NavLink to="/admin/experience" className={linkClass}>
              <i className="fas fa-graduation-cap w-5"></i>
              <span>Journey</span>
            </NavLink>

            <NavLink to="/admin/resume" className={linkClass}>
              <i className="fas fa-file-alt w-5"></i>
              <span>Resume Design</span>
            </NavLink>

            <NavLink to="/admin/messages" className={linkClass}>
              <i className="fas fa-envelope w-5"></i>
              <span>Messages</span>
              <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                3
              </span>
            </NavLink>
          </nav>

          {/* USER CARD */}
          <div className="mt-8">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white uppercase overflow-hidden">
                {user?.username?.charAt(0) || 'R'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate text-white">{user?.username || 'Rudra'}</p>
                <p className="text-[10px] text-zinc-500 capitalize">{user?.role || 'Viewer'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Aside