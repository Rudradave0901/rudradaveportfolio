import '../css/admin.css'

import Aside from '../components/Aside'
import Header from '../components/Header'
import { Outlet } from "react-router-dom"

const AdminPage = () => {
  return (
    <>
      <div className="admin-page-wrapper">
        <Aside />
        <main class="flex-1 md:ml-64 p-6 md:p-10 transition-all duration-300 h-screen">
          <Header />
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default AdminPage