import '../css/admin.css'

import Aside from '../components/Aside'
import Header from '../components/Header'
// import Dashboard from '../components/Dashboard'
// import Projects from '../components/Projects'
// import Skills from '../components/Skills'
// import ExpEducation from '../components/ExpEducation'
// import Resume from '../components/Resume'
import { Outlet } from "react-router-dom"
// import Message from '../components/Message'

const AdminPage = () => {
  return (
    <>
        <div className="admin-page-wrapper">
            <Aside />
            <main class="flex-1 md:ml-64 p-6 md:p-10 transition-all duration-300 h-screen">
                <Header />
                <Outlet />
                {/* <Dashboard />
                <Projects />
                <Skills />
                <ExpEducation />
                <Resume /> */}
            </main>
        </div>
    </>
  )
}

export default AdminPage