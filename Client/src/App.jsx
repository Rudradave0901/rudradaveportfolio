import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Components
import GlobalLoader from "./components/ui/GlobalLoader";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Lazy Loaded Pages
const HomePage = React.lazy(() => import("./pages/HomePage"));
const Resume = React.lazy(() => import("./pages/ResumePage"));
const ProjectsPage = React.lazy(() => import("./pages/ProjectsPage"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const Signup = React.lazy(() => import("./pages/auth/Signup"));
const GoogleDoc = React.lazy(() => import("./components/GoogleDoc"));

// Lazy Loaded Admin Pages
const AdminPage = React.lazy(() => import("./admin/pages/AdminPage"));
const DaySchedule = React.lazy(() => import("./admin/pages/DaySchedule"));
const Projects = React.lazy(() => import("./admin/components/Projects"));
const Skills = React.lazy(() => import("./admin/components/Skills"));
const ExpEducation = React.lazy(() => import("./admin/components/ExpEducation"));
const Dashboard = React.lazy(() => import("./admin/components/Dashboard"));
const ResumeAdmin = React.lazy(() => import("./admin/components/ResumeAdmin"));
const AboutAdmin = React.lazy(() => import("./admin/components/About"));
const BannerAdmin = React.lazy(() => import("./admin/components/Banner"));
const Message = React.lazy(() => import("./admin/components/Message"));

// Fallback loader for Suspense
const SuspenseFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-zinc-950">
    <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <>
      <GlobalLoader />
      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/googledoc" element={<GoogleDoc />} />
          <Route path="/schedule" element={<DaySchedule />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin", "viewer"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          >
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
      </Suspense>
    </>
  );
}

export default App;
