import React, { useState, useRef } from "react";
import useSkills from "../../hooks/useSkills";
import { useAuth } from "../../context/AuthContext";

const BASE_URL = "https://rudradaveportfolio.onrender.com";

const Skills = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";
    const {
        skills,
        loading,
        error,
        addSkill,
        editSkill,
        removeSkill,
    } = useSkills();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentSkillId, setCurrentSkillId] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        skillName: "",
        skillContent: "",
        skillUse: "",
        skillImage: null,
    });

    const resetForm = () => {
        setFormData({
            skillName: "",
            skillContent: "",
            skillUse: "",
            skillImage: null,
        });
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const openAddModal = () => {
        if (!isAdmin) return;
        setIsEditMode(false);
        setCurrentSkillId(null);
        resetForm();
        setIsModalOpen(true);
    };

    const openEditModal = (skill) => {
        if (!isAdmin) return;
        setIsEditMode(true);
        setCurrentSkillId(skill._id);
        setFormData({
            skillName: skill.skillName || "",
            skillContent: skill.skillContent || "",
            skillUse: skill.skillUse || "",
            skillImage: null,
        });
        setImagePreview(`${BASE_URL}${skill.skillImageURL}`);
        setIsModalOpen(true);
    };

    const handleImageChange = (e) => {
        if (!isAdmin) return;
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, skillImage: file });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAdmin) return;

        const data = new FormData();
        data.append("skillName", formData.skillName);
        data.append("skillContent", formData.skillContent);
        data.append("skillUse", formData.skillUse);
        if (formData.skillImage) {
            data.append("skillImageURL", formData.skillImage);
        }

        let response;
        if (isEditMode) {
            response = await editSkill(currentSkillId, data);
        } else {
            response = await addSkill(data);
        }

        if (response?.success) {
            setIsModalOpen(false);
            resetForm();
        }
    };

    const handleDelete = async (id) => {
        if (!isAdmin) return;
        if (window.confirm("Are you sure you want to delete this skill?")) {
            await removeSkill(id);
        }
    };

    return (
        <section id="section-skills" className="content-section py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div className="flex items-center gap-4">
                        <div>
                            <h3 className="text-3xl font-extrabold text-white tracking-tight">
                                Essential Tools
                            </h3>
                            <p className="mt-2 text-zinc-400">
                                Manage the technologies and tools in your arsenal.
                            </p>
                        </div>
                        {!isAdmin && (
                            <div className="px-4 py-1.5 bg-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-widest rounded-full border border-zinc-700">
                                <i className="fas fa-eye mr-2"></i>
                                Read Only Mode
                            </div>
                        )}
                    </div>
                    {isAdmin && (
                        <button
                            onClick={openAddModal}
                            className="inline-flex items-center px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(8,145,178,0.3)]"
                        >
                            <i className="fas fa-plus mr-2 text-xs"></i>
                            Add New Tool
                        </button>
                    )}
                </div>

                {loading && !isModalOpen && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-zinc-900/50 rounded-2xl h-32 animate-pulse border border-zinc-800" />
                        ))}
                    </div>
                )}

                {!loading && skills.length === 0 && (
                    <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800">
                        <i className="fas fa-tools text-5xl text-zinc-700 mb-4"></i>
                        <p className="text-zinc-500 font-medium">No tools found. {isAdmin ? 'Click "Add New Tool" to get started.' : ''}</p>
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {skills.map((skill) => (
                        <div
                            key={skill._id}
                            className="group relative bg-zinc-900 p-6 rounded-2xl border border-zinc-800/50 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)] flex flex-col items-center gap-3 overflow-hidden text-center"
                        >
                            <div className="w-14 h-14 p-3 bg-zinc-800 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                <img
                                    src={`${BASE_URL}${skill.skillImageURL}`}
                                    alt={skill.skillName}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="z-10">
                                <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                                    {skill.skillName}
                                </h4>
                                <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest leading-none">
                                    {skill.skillUse}
                                </p>
                            </div>

                            {/* Actions Overlay */}
                            {isAdmin && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => openEditModal(skill)}
                                        className="w-8 h-8 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all border border-zinc-700"
                                    >
                                        <i className="fas fa-edit text-xs"></i>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(skill._id)}
                                        className="w-8 h-8 flex items-center justify-center bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-500 rounded-lg transition-all border border-zinc-700 hover:border-red-500/50"
                                    >
                                        <i className="fas fa-trash text-xs"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Premium Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto">
                    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] my-auto animate-in fade-in zoom-in duration-200">
                        <div className="px-8 py-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                            <div>
                                <h3 className="text-2xl font-bold text-white">
                                    {isEditMode ? "Edit Tool" : "Add New Tool"}
                                </h3>
                                <p className="text-sm text-zinc-400 mt-1">Provide the details for the tool.</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-colors"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="space-y-6 mb-8">
                                <div className="flex flex-col items-center mb-6">
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="relative w-24 h-24 rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-900 hover:bg-zinc-800/50 hover:border-cyan-500/50 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center group"
                                    >
                                        {imagePreview ? (
                                            <>
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-4" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-white text-[10px] font-bold">
                                                    Change
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-cloud-upload-alt text-2xl text-zinc-600 mb-1 group-hover:text-cyan-500 transition-colors"></i>
                                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Icon / Logo</span>
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
                                    <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-widest">Recommended size: 64x64px</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Tool Name</label>
                                    <input
                                        type="text"
                                        name="skillName"
                                        value={formData.skillName}
                                        onChange={handleInputChange}
                                        placeholder="E.g. VS Code, React, Photoshop"
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Category / Usage</label>
                                    <input
                                        type="text"
                                        name="skillUse"
                                        value={formData.skillUse}
                                        onChange={handleInputChange}
                                        placeholder="E.g. Web Framework, Design Tool"
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Brief Description (Optional)</label>
                                    <textarea
                                        name="skillContent"
                                        value={formData.skillContent}
                                        onChange={handleInputChange}
                                        placeholder="What do you use this tool for?"
                                        rows="3"
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(8,145,178,0.3)]"
                                >
                                    {loading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </span>
                                    ) : (
                                        isEditMode ? "Update Tool" : "Save Tool"
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

export default Skills;