import React, { useState, useRef } from "react";
import useProjects from "../../hooks/useProjects";
import { useAuth } from "../../context/AuthContext";
import { isAdmin as checkIsAdmin } from "../../utils/authUtils";
import { API_CONSTANTS } from "../../constants/appConstants";

const BASE_URL = API_CONSTANTS.SERVER_URL;

const Projects = () => {
  const { user } = useAuth();
  const isAdmin = checkIsAdmin(user);
  const {
    projects,
    loading,
    error,
    addProject,
    editProject,
    removeProject,
  } = useProjects();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    projectName: "",
    projectURL: "",
    projectImage: null,
    stack: {
      frontend: [],
      backend: [],
      tools: [],
      tags: [],
    },
  });

  const resetForm = () => {
    setFormData({
      projectName: "",
      projectURL: "",
      projectImage: null,
      stack: {
        frontend: [],
        backend: [],
        tools: [],
        tags: [],
      },
    });
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openAddModal = () => {
    if (!isAdmin) return;
    setIsEditMode(false);
    setCurrentProjectId(null);
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    if (!isAdmin) return;
    setIsEditMode(true);
    setCurrentProjectId(project._id);
    setFormData({
      projectName: project.projectName || "",
      projectURL: project.projectURL || "",
      projectImage: null, // Don't reset image unless changed
      stack: {
        frontend: project.stack?.frontend || [],
        backend: project.stack?.backend || [],
        tools: project.stack?.tools || [],
        tags: project.stack?.tags || [],
      },
    });
    setImagePreview(`${BASE_URL}${project.projectImageURL}`);
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    if (!isAdmin) return;
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, projectImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    if (!isAdmin) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStackChange = (category, value) => {
    if (!isAdmin) return;
    const items = value.split(", ").map((t) => t.trim()).filter(Boolean);
    setFormData((prev) => ({
      ...prev,
      stack: {
        ...prev.stack,
        [category]: items,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    const data = new FormData();
    data.append("projectName", formData.projectName);
    data.append("projectURL", formData.projectURL);
    if (formData.projectImage) {
      data.append("projectImageURL", formData.projectImage);
    }
    data.append("stack", JSON.stringify(formData.stack));

    let response;
    if (isEditMode) {
      response = await editProject(currentProjectId, data);
    } else {
      response = await addProject(data);
    }

    if (response?.success) {
      setIsModalOpen(false);
      resetForm();
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (window.confirm("Are you sure you want to delete this project?")) {
      await removeProject(id);
    }
  };

  return (
    <section id="section-projects" className="content-section py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <div>
              <h3 className="text-3xl font-extrabold text-white tracking-tight">
                Portfolio Projects
              </h3>
              <p className="mt-2 text-zinc-400">
                Showcase and manage your best work.
              </p>
            </div>
            {!isAdmin && (
              <div className="px-4 py-1.5 bg-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-widest rounded-full border border-zinc-700">
                <i className="fas fa-eye mr-2"></i>
                Read Only
              </div>
            )}
          </div>
          {isAdmin && (
            <button
              onClick={openAddModal}
              className="inline-flex items-center px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(14,165,233,0.3)]"
            >
              <i className="fas fa-plus mr-2 text-xs"></i>
              Add New Project
            </button>
          )}
        </div>

        {loading && !isModalOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-zinc-900/50 rounded-2xl h-80 animate-pulse border border-zinc-800" />
            ))}
          </div>
        )}

        {!loading && projects.length === 0 && (
          <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800">
            <i className="fas fa-folder-open text-5xl text-zinc-700 mb-4"></i>
            <p className="text-zinc-500 font-medium">No projects found. {isAdmin ? 'Click "Add New Project" to get started.' : ''}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project._id}
              className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800/50 hover:border-sky-500/50 transition-all duration-300 hover:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)] flex flex-col"
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={`${BASE_URL}${project.projectImageURL}`}
                  alt={project.projectName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-60"></div>
              </div>

              {/* Content */}
              <div className="p-6 flex-grow">
                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">
                  {project.projectName}
                </h4>

                <div className="flex flex-wrap gap-2 mb-4">
                  {(project.stack?.tags || []).slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 rounded-md border border-sky-500/20">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-4">
                  {project.stack?.frontend?.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-zinc-500 tracking-widest mb-1.5 ml-0.5">Frontend</p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.stack.frontend.map(t => (
                          <span key={t} className="text-xs text-zinc-400 bg-zinc-800/50 px-2 py-0.5 rounded border border-zinc-700/50">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {project.stack?.backend?.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-zinc-500 tracking-widest mb-1.5 ml-0.5">Backend</p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.stack.backend.map(t => (
                          <span key={t} className="text-xs text-zinc-400 bg-zinc-800/50 px-2 py-0.5 rounded border border-zinc-700/50">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 bg-zinc-950/50 border-t border-zinc-800 flex items-center justify-between">
                <a
                  href={project.projectURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-zinc-400 hover:text-sky-400 flex items-center transition-colors"
                >
                  <i className="fas fa-external-link-alt mr-2"></i>
                  View Live
                </a>
                {isAdmin && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(project)}
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-all border border-zinc-700"
                    >
                      <i className="fas fa-edit text-sm"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="p-2 bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-500 rounded-lg transition-all border border-zinc-700 hover:border-red-500/50"
                    >
                      <i className="fas fa-trash text-sm"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] my-auto animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {isEditMode ? "Edit Project" : "Create New Project"}
                </h3>
                <p className="text-sm text-zinc-400 mt-1">Fill in the details below.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Left Side: Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Project Name</label>
                    <input
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleInputChange}
                      placeholder="E.g. E-Commerce Platform"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Project Link</label>
                    <input
                      type="url"
                      name="projectURL"
                      value={formData.projectURL}
                      onChange={handleInputChange}
                      placeholder="https://..."
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Project Image</label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="relative h-40 rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-900 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center group"
                    >
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                            <span className="text-white text-xs font-bold">Change Image</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-cloud-upload-alt text-3xl text-zinc-600 mb-2 group-hover:text-sky-500 transition-colors"></i>
                          <span className="text-xs text-zinc-500">Upload Project Thumbnail</span>
                        </>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                      required={!isEditMode}
                    />
                  </div>
                </div>

                {/* Right Side: Tech Stack */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Frontend Stack</label>
                    <input
                      type="text"
                      placeholder="React, Next.js, GSAP..."
                      value={formData.stack.frontend.join(", ")}
                      onChange={(e) => handleStackChange("frontend", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Backend Stack</label>
                    <input
                      type="text"
                      placeholder="Node.js, MongoDB, Redis..."
                      value={formData.stack.backend.join(", ")}
                      onChange={(e) => handleStackChange("backend", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Tools</label>
                    <input
                      type="text"
                      placeholder="Docker, Kubernetes, Figma..."
                      value={formData.stack.tools.join(", ")}
                      onChange={(e) => handleStackChange("tools", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Tags</label>
                    <input
                      type="text"
                      placeholder="E-commerce, Portfolio, SaaS..."
                      value={formData.stack.tags.join(", ")}
                      onChange={(e) => handleStackChange("tags", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-all"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(14,165,233,0.3)]"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    isEditMode ? "Update Project" : "Create Project"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;


