import { Routes, Route } from "react-router";

// Components
import HomePage from "./pages/HomePage";
import Resume from "./pages/ResumePage";
// import ContentUploadSamplee from "./components/contentUploadSample";
import AdminPage from "./admin/pages/AdminPage";
import Projects from "./admin/components/Projects";
import Skills from "./admin/components/Skills";
import ExpEducation from "./admin/components/ExpEducation";
import Dashboard from "./admin/components/Dashboard";
import ResumeAdmin from "./admin/components/ResumeAdmin";
import AboutAdmin from "./admin/components/About";
import BannerAdmin from "./admin/components/Banner";
import Message from "./admin/components/Message";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/admin" element={<AdminPage />} /> */}
        <Route path="/resume" element={<Resume />} />



        <Route path="/admin" element={<AdminPage />}>
          <Route index element={<Dashboard />} />
          <Route path="banner" element={<BannerAdmin />} />
          <Route path="about" element={<AboutAdmin />} />
          <Route path="projects" element={<Projects />} />
          <Route path="skills" element={<Skills />} />
          <Route path="experience" element={<ExpEducation />} />
          <Route path="resume" element={<ResumeAdmin />} />
          <Route path="messages" element={<Message />} />
        </Route>



      </Routes>
    </>
  )
}

export default App
