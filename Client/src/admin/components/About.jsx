import React, { useState, useEffect } from 'react';
import useAbout from '../../hooks/useAbout';
import { useAuth } from '../../context/AuthContext';
import { isAdmin as checkIsAdmin } from '../../utils/authUtils';

const AboutAdmin = () => {
    const { user } = useAuth();
    const isAdmin = checkIsAdmin(user);
    const { aboutData, loading, error, createAbout, updateAbout } = useAbout();
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        aboutContent: '',
        projectsDone: 0,
        yearsOfExperience: 0
    });

    useEffect(() => {
        if (aboutData) {
            setFormData({
                aboutContent: aboutData.aboutContent || '',
                projectsDone: aboutData.projectsDone || 0,
                yearsOfExperience: aboutData.yearsOfExperience || 0
            });
        }
    }, [aboutData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAdmin) return;
        setIsSaving(true);

        const result = aboutData
            ? await updateAbout(formData)
            : await createAbout(formData);

        if (result.success) {
            alert(result.message);
        } else {
            alert(result.message);
        }
        setIsSaving(false);
    };

    if (loading && !aboutData) return <div className="p-10 text-center text-zinc-500">Loading About Data...</div>;

    return (
        <section id="about-admin" className="content-section py-6 px-4">
            <div className="max-w-4xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-zinc-800">
                    <div className="flex items-center gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-white">About Me Editor</h2>
                            <p className="text-zinc-500 mt-1">Manage your professional biography and statistics.</p>
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
                            onClick={handleSubmit}
                            disabled={isSaving}
                            className="inline-flex items-center px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(8,145,178,0.2)] disabled:opacity-50 group"
                        >
                            {isSaving ? (
                                <i className="fas fa-spinner fa-spin mr-2"></i>
                            ) : (
                                <i className="fas fa-save mr-2 group-hover:scale-110 transition-transform"></i>
                            )}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    )}
                </header>

                <div className="bg-zinc-900/30 rounded-3xl border border-zinc-800 p-8 shadow-2xl backdrop-blur-sm space-y-8">
                    {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-2xl text-sm">{error}</div>}

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 ml-1">Professional Biography</label>
                            <textarea
                                value={formData.aboutContent}
                                onChange={(e) => isAdmin && setFormData({ ...formData, aboutContent: e.target.value })}
                                readOnly={!isAdmin}
                                rows={10}
                                className={`w-full px-5 py-4 rounded-3xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none ${isAdmin ? 'focus:border-cyan-500' : ''} transition-all font-s-16 resize-none leading-relaxed`}
                                placeholder="Describe your professional journey and expertise..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 ml-1">Projects Completed</label>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        value={formData.projectsDone}
                                        onChange={(e) => isAdmin && setFormData({ ...formData, projectsDone: parseInt(e.target.value) || 0 })}
                                        readOnly={!isAdmin}
                                        className={`w-full px-5 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none ${isAdmin ? 'focus:border-cyan-500' : ''} transition-all font-s-16 shadow-inner`}
                                        placeholder="e.g. 50"
                                    />
                                    {isAdmin && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-500 font-bold">+</div>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 ml-1">Years of Experience</label>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        value={formData.yearsOfExperience}
                                        onChange={(e) => isAdmin && setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
                                        readOnly={!isAdmin}
                                        className={`w-full px-5 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none ${isAdmin ? 'focus:border-cyan-500' : ''} transition-all font-s-16 shadow-inner`}
                                        placeholder="e.g. 5"
                                    />
                                    {isAdmin && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-500 font-bold">+</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-6 rounded-2xl bg-cyan-600/5 border border-cyan-500/10 flex items-start gap-4">
                    <i className="fas fa-info-circle text-cyan-500 mt-1"></i>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                        {isAdmin
                            ? <span>Changes made here will reflect immediately on the <span className="text-white font-medium">About</span> section of your public portfolio. Ensure your biography is concise and highlights your core strengths.</span>
                            : <span>You are currently in <span className="text-white font-medium">Viewer Mode</span>. Only Administrators can modify the content of the About section.</span>
                        }
                    </p>
                </div>
            </div>
        </section>
    );
};

export default AboutAdmin;
