import React, { useState } from 'react';
import useEduExp from '../../hooks/useEduExp';
import { useAuth } from '../../context/AuthContext';
import { isAdmin as checkIsAdmin } from '../../utils/authUtils';

const ExpEducation = () => {
    const { user } = useAuth();
    const isAdmin = checkIsAdmin(user);
    const { eduExpData, loading, error, addEduExp, editEduExp, removeEduExp } = useEduExp();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('education'); // 'education' or 'experience'
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [currentDocId, setCurrentDocId] = useState(null);

    const [formData, setFormData] = useState({
        title: '', // courseName or designation
        organization: '', // instituteName or companyName
        startDate: '',
        endDate: '',
        location: '',
        description: '' // comma separated string for input
    });

    const resetForm = () => {
        setFormData({
            title: '',
            organization: '',
            startDate: '',
            endDate: '',
            location: '',
            description: ''
        });
    };

    const openAddModal = (type) => {
        if (!isAdmin) return;
        setModalType(type);
        setIsEditMode(false);
        resetForm();
        setIsModalOpen(true);
    };

    const openEditModal = (type, index, item, docId) => {
        if (!isAdmin) return;
        setModalType(type);
        setIsEditMode(true);
        setCurrentIndex(index);
        setCurrentDocId(docId);
        setFormData({
            title: type === 'education' ? item.courseName : item.designation,
            organization: type === 'education' ? item.instituteName : item.companyName,
            startDate: item.startDate,
            endDate: item.endDate,
            location: item.location,
            description: (item.description || []).join(', ')
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAdmin) return;

        const itemData = {
            [modalType === 'education' ? 'courseName' : 'designation']: formData.title,
            [modalType === 'education' ? 'instituteName' : 'companyName']: formData.organization,
            startDate: formData.startDate,
            endDate: formData.endDate,
            location: formData.location,
            description: formData.description.split(',').map(s => s.trim()).filter(Boolean)
        };

        // If no document exists, create one
        if (eduExpData.length === 0) {
            const newDoc = {
                education: modalType === 'education' ? [itemData] : [],
                experience: modalType === 'experience' ? [itemData] : []
            };
            await addEduExp(newDoc);
        } else {
            // Target the first document
            const doc = eduExpData[0];
            const updatedDoc = { ...doc };

            if (isEditMode) {
                updatedDoc[modalType][currentIndex] = itemData;
            } else {
                updatedDoc[modalType] = [...(updatedDoc[modalType] || []), itemData];
            }

            await editEduExp(doc._id, updatedDoc);
        }

        setIsModalOpen(false);
        resetForm();
    };

    const handleDelete = async (type, index, docId) => {
        if (!isAdmin) return;
        if (!window.confirm("Are you sure you want to delete this milestone?")) return;

        const doc = eduExpData.find(d => d._id === docId);
        if (!doc) return;

        const updatedDoc = { ...doc };
        updatedDoc[type].splice(index, 1);

        await editEduExp(docId, updatedDoc);
    };

    if (loading && !isModalOpen) return <div className="p-10 text-center">Loading...</div>;

    return (
        <section id="section-journey" className="content-section py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Education */}
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold flex items-center gap-3">
                                <i className="fas fa-book-reader text-cyan-500"></i> Learning Journey
                            </h3>
                            {!isAdmin && (
                                <span className="px-3 py-1 bg-zinc-800 text-zinc-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-zinc-700">Read Only</span>
                            )}
                        </div>
                        <div className="space-y-6">
                            {isAdmin && (
                                <button
                                    onClick={() => openAddModal('education')}
                                    className="w-full card add-new-card min-h-[100px] p-6 mb-6 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 hover:border-cyan-500/50 transition-all"
                                >
                                    <i className="fas fa-plus mb-2 text-zinc-500"></i>
                                    <p className="text-sm text-zinc-500 font-medium">Add Education Milestone</p>
                                </button>
                            )}

                            {eduExpData.map(doc => doc.education.map((edu, idx) => (
                                <div key={`${doc._id}-edu-${idx}`} className="card p-6 border-l-4 border-l-cyan-500 relative group bg-zinc-900/50 hover:bg-zinc-900 transition-all rounded-xl border border-zinc-800">
                                    {isAdmin && (
                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEditModal('education', idx, edu, doc._id)} className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center hover:bg-cyan-500/20 text-zinc-400 hover:text-cyan-500 border border-zinc-700"><i className="fas fa-edit text-xs"></i></button>
                                            <button onClick={() => handleDelete('education', idx, doc._id)} className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center hover:bg-red-500/20 text-zinc-400 hover:text-red-500 border border-zinc-700"><i className="fas fa-trash text-xs"></i></button>
                                        </div>
                                    )}
                                    <div className="flex justify-between mb-4 pr-12">
                                        <div>
                                            <h4 className="font-bold text-lg text-white">{edu.courseName}</h4>
                                            <p className="text-sm text-zinc-400">{edu.instituteName}, {edu.location}</p>
                                        </div>
                                        <span className="text-xs bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full h-fit border border-zinc-700 font-medium whitespace-nowrap">{edu.startDate} - {edu.endDate}</span>
                                    </div>
                                    <ul className="text-sm text-zinc-400 space-y-2">
                                        {edu.description.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <i className="fas fa-circle text-[6px] text-cyan-500 mt-2"></i>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )))}
                        </div>
                    </div>

                    {/* Experience */}
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold flex items-center gap-3">
                                <i className="fas fa-user-tie text-cyan-500"></i> Professional Background
                            </h3>
                            {!isAdmin && (
                                <span className="px-3 py-1 bg-zinc-800 text-zinc-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-zinc-700">Read Only</span>
                            )}
                        </div>
                        <div className="space-y-6">
                            {isAdmin && (
                                <button
                                    onClick={() => openAddModal('experience')}
                                    className="w-full card add-new-card min-h-[100px] p-6 mb-6 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 hover:border-cyan-500/50 transition-all"
                                >
                                    <i className="fas fa-plus mb-2 text-zinc-500"></i>
                                    <p className="text-sm text-zinc-500 font-medium">Add Job Experience</p>
                                </button>
                            )}

                            {eduExpData.map(doc => doc.experience.map((exp, idx) => (
                                <div key={`${doc._id}-exp-${idx}`} className="card p-6 border-l-4 border-l-cyan-500 relative group bg-zinc-900/50 hover:bg-zinc-900 transition-all rounded-xl border border-zinc-800">
                                    {isAdmin && (
                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEditModal('experience', idx, exp, doc._id)} className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center hover:bg-cyan-500/20 text-zinc-400 hover:text-cyan-500 border border-zinc-700"><i className="fas fa-edit text-xs"></i></button>
                                            <button onClick={() => handleDelete('experience', idx, doc._id)} className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center hover:bg-red-500/20 text-zinc-400 hover:text-red-500 border border-zinc-700"><i className="fas fa-trash text-xs"></i></button>
                                        </div>
                                    )}
                                    <div className="flex justify-between mb-4 pr-12">
                                        <div>
                                            <h4 className="font-bold text-lg text-white">{exp.designation}</h4>
                                            <p className="text-sm text-zinc-400">@{exp.companyName}, {exp.location}</p>
                                        </div>
                                        <span className="text-xs bg-cyan-500/10 text-cyan-500 px-3 py-1 rounded-full h-fit border border-cyan-500/20 font-medium whitespace-nowrap">{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    <ul className="text-sm text-zinc-400 space-y-2">
                                        {exp.description.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <i className="fas fa-circle text-[6px] text-cyan-500 mt-2"></i>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">
                                {isEditMode ? 'Edit' : 'Add'} {modalType === 'education' ? 'Education' : 'Experience'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">{modalType === 'education' ? 'Course' : 'Designation'}</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-cyan-500 transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">{modalType === 'education' ? 'Institute' : 'Company'}</label>
                                <input
                                    type="text"
                                    value={formData.organization}
                                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-cyan-500 transition-all"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Start Date</label>
                                    <input
                                        type="text"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        placeholder="E.g. 2020"
                                        className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-cyan-500 transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">End Date</label>
                                    <input
                                        type="text"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        placeholder="E.g. 2023 or Present"
                                        className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-cyan-500 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-cyan-500 transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Description (Comma separated)</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows="3"
                                    className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-cyan-500 transition-all resize-none"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 rounded-lg bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition-all">Cancel</button>
                                <button type="submit" className="px-5 py-2 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-600/20">{isEditMode ? 'Update' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ExpEducation;