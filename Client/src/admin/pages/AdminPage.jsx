import { useState } from 'react'
import '../css/admin.css'

import Aside from '../components/Aside'
import Header from '../components/Header'
import { Outlet } from "react-router-dom"

const AdminPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      <div className="admin-page-wrapper flex min-h-screen relative">
        {/* Mobile Backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] md:hidden transition-opacity duration-300"
            onClick={toggleSidebar}
          />
        )}

        <Aside isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <main className="flex-1 flex flex-col min-h-screen transition-all duration-300 md:ml-64">
          <div className="p-4 md:p-8 lg:p-10 flex-1 overflow-x-hidden w-full">
            <Header toggleSidebar={toggleSidebar} />
            <div className="mt-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default AdminPage