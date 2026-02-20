import React, { useState, useEffect } from 'react';
import useResume from '../../hooks/useResume';

const ResumeAdmin = () => {
  const { resumeData, loading, error, updateResume, createResume, setResumeData } = useResume();
  const [activeTab, setActiveTab] = useState("header");
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = async () => {
    setIsSaving(true);
    const result = resumeData._id
      ? await updateResume(resumeData)
      : await createResume(resumeData);

    if (result.success) {
      alert(result.message);
    } else {
      alert(result.message);
    }
    setIsSaving(false);
  };

  if (loading && !resumeData) return <div className="p-10 text-center text-zinc-500">Loading Resume Data...</div>;

  const navTabs = [
    { id: 'header', label: 'Identity & About', icon: 'fa-user-circle' },
    { id: 'contact', label: 'Connections', icon: 'fa-address-book' },
    { id: 'skills', label: 'Professional Skills', icon: 'fa-layer-group' },
    { id: 'highlights', label: 'Highlights & Achievements', icon: 'fa-award' }
  ];

  return (
    <section id="resume-admin" className="content-section py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-zinc-800">
          <div>
            <h2 className="text-3xl font-bold text-white">Resume Designer</h2>
            <p className="text-zinc-500 mt-1">Refine your professional narrative across all sections.</p>
          </div>
          <button
            onClick={handleUpdate}
            disabled={isSaving || !resumeData}
            className="inline-flex items-center px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(8,145,178,0.2)] disabled:opacity-50 group"
          >
            {isSaving ? (
              <i className="fas fa-spinner fa-spin mr-2"></i>
            ) : (
              <i className="fas fa-save mr-2 group-hover:scale-110 transition-transform"></i>
            )}
            {isSaving ? 'Synchronizing...' : 'Save All Changes'}
          </button>
        </header>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Navigation Sidebar */}
          <nav className="lg:w-64 space-y-2">
            {navTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${activeTab === tab.id
                    ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
              >
                <i className={`fas ${tab.icon} w-5`}></i>
                <span className="font-semibold">{tab.label}</span>
                {activeTab === tab.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>}
              </button>
            ))}
          </nav>

          {/* Editor Canvas */}
          <div className="flex-1 bg-zinc-900/30 rounded-3xl border border-zinc-800 p-8 shadow-2xl backdrop-blur-sm">
            {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-2xl text-sm">{error}</div>}

            {activeTab === 'header' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Full Name"
                    value={resumeData?.profile?.name}
                    onChange={(v) => setResumeData({ ...resumeData, profile: { ...resumeData.profile, name: v } })}
                  />
                  <FormInput
                    label="Professional Title"
                    value={resumeData?.profile?.role}
                    onChange={(v) => setResumeData({ ...resumeData, profile: { ...resumeData.profile, role: v } })}
                  />
                </div>
                <FormTextArea
                  label="Professional Summary"
                  value={resumeData?.about}
                  onChange={(v) => setResumeData({ ...resumeData, about: v })}
                  rows={10}
                />
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="Email Address" value={resumeData?.contact?.email} onChange={(v) => setResumeData({ ...resumeData, contact: { ...resumeData.contact, email: v } })} />
                  <FormInput label="Phone Number" value={resumeData?.contact?.phone} onChange={(v) => setResumeData({ ...resumeData, contact: { ...resumeData.contact, phone: v } })} />
                  <FormInput label="Location" value={resumeData?.contact?.location} onChange={(v) => setResumeData({ ...resumeData, contact: { ...resumeData.contact, location: v } })} />
                  <FormInput label="Portfolio Link" value={resumeData?.contact?.portfolio} onChange={(v) => setResumeData({ ...resumeData, contact: { ...resumeData.contact, portfolio: v } })} />
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {resumeData?.skills?.map((group, gi) => (
                  <div key={gi} className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 relative group/card">
                    <button
                      onClick={() => {
                        const updated = resumeData.skills.filter((_, idx) => idx !== gi);
                        setResumeData({ ...resumeData, skills: updated });
                      }}
                      className="absolute top-4 right-4 text-zinc-600 hover:text-red-500 transition-colors"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>

                    <input
                      value={group.title}
                      onChange={(e) => {
                        const updated = [...resumeData.skills];
                        updated[gi].title = e.target.value;
                        setResumeData({ ...resumeData, skills: updated });
                      }}
                      className="bg-transparent text-xl font-bold text-white border-b border-zinc-800 focus:border-cyan-500 focus:outline-none pb-2 mb-6 w-full max-w-sm"
                      placeholder="Group Title (e.g. Frontend)"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {group.items.map((item, ii) => (
                        <div key={ii} className="flex items-center gap-2 group/item">
                          <input
                            value={item}
                            onChange={(e) => {
                              const updated = [...resumeData.skills];
                              updated[gi].items[ii] = e.target.value;
                              setResumeData({ ...resumeData, skills: updated });
                            }}
                            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-300 focus:border-cyan-500 focus:outline-none"
                          />
                          <button
                            onClick={() => {
                              const updated = [...resumeData.skills];
                              updated[gi].items.splice(ii, 1);
                              setResumeData({ ...resumeData, skills: updated });
                            }}
                            className="text-zinc-600 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const updated = [...resumeData.skills];
                          updated[gi].items.push("");
                          setResumeData({ ...resumeData, skills: updated });
                        }}
                        className="border border-dashed border-zinc-800 rounded-xl py-2 text-xs font-bold text-zinc-500 hover:text-cyan-500 hover:border-cyan-500/50 transition-all uppercase tracking-widest"
                      >
                        + Add Skill
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => {
                    setResumeData({
                      ...resumeData,
                      skills: [...(resumeData.skills || []), { title: 'New Group', items: [''] }]
                    });
                  }}
                  className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-3xl text-zinc-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-all font-bold flex items-center justify-center gap-3"
                >
                  <i className="fas fa-plus"></i>
                  ADD NEW SKILL CATEGORY
                </button>
              </div>
            )}

            {activeTab === 'highlights' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* Experience Section */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                      <i className="fas fa-briefcase text-cyan-500"></i>
                      Professional Experience
                    </h3>
                    <button
                      onClick={() => {
                        setResumeData({
                          ...resumeData,
                          experience: [...(resumeData.experience || []), {
                            companyName: '', title: '', location: '', startDate: '', endDate: 'Present', points: ['']
                          }]
                        });
                      }}
                      className="text-xs font-bold text-cyan-500 uppercase tracking-widest hover:text-cyan-400 transition-colors"
                    >
                      + Add New Role
                    </button>
                  </div>

                  <div className="space-y-6">
                    {resumeData?.experience?.map((exp, ei) => (
                      <div key={ei} className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 group/exp">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <FormInput label="Company" value={exp.compenyName} onChange={(v) => {
                            const updated = [...resumeData.experience];
                            updated[ei].compenyName = v;
                            setResumeData({ ...resumeData, experience: updated });
                          }} />
                          <FormInput label="Role" value={exp.title} onChange={(v) => {
                            const updated = [...resumeData.experience];
                            updated[ei].title = v;
                            setResumeData({ ...resumeData, experience: updated });
                          }} />
                          <FormInput label="Location" value={exp.location} onChange={(v) => {
                            const updated = [...resumeData.experience];
                            updated[ei].location = v;
                            setResumeData({ ...resumeData, experience: updated });
                          }} />
                          <div className="grid grid-cols-2 gap-4">
                            <FormInput label="Start" value={exp.startDate} onChange={(v) => {
                              const updated = [...resumeData.experience];
                              updated[ei].startDate = v;
                              setResumeData({ ...resumeData, experience: updated });
                            }} />
                            <FormInput label="End" value={exp.endDate} onChange={(v) => {
                              const updated = [...resumeData.experience];
                              updated[ei].endDate = v;
                              setResumeData({ ...resumeData, experience: updated });
                            }} />
                          </div>
                        </div>

                        <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2 ml-1">Key Contributions</label>
                        <div className="space-y-2 mb-4">
                          {exp.points.map((pt, pi) => (
                            <div key={pi} className="flex gap-2">
                              <input
                                value={pt}
                                onChange={(e) => {
                                  const updated = [...resumeData.experience];
                                  updated[ei].points[pi] = e.target.value;
                                  setResumeData({ ...resumeData, experience: updated });
                                }}
                                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-300 focus:border-cyan-500 focus:outline-none"
                              />
                              <button
                                onClick={() => {
                                  const updated = [...resumeData.experience];
                                  updated[ei].points.splice(pi, 1);
                                  setResumeData({ ...resumeData, experience: updated });
                                }}
                                className="text-zinc-600 hover:text-red-500 p-2"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <button
                            onClick={() => {
                              const updated = [...resumeData.experience];
                              updated[ei].points.push("");
                              setResumeData({ ...resumeData, experience: updated });
                            }}
                            className="text-xs font-bold text-zinc-500 hover:text-cyan-500 transition-colors uppercase tracking-widest"
                          >
                            + Add Contribution Point
                          </button>
                          <button
                            onClick={() => {
                              const updated = resumeData.experience.filter((_, idx) => idx !== ei);
                              setResumeData({ ...resumeData, experience: updated });
                            }}
                            className="text-xs font-bold text-red-900/50 hover:text-red-500 transition-colors uppercase tracking-widest"
                          >
                            Delete Role
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements & Languages */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ListManager
                    title="Achievements"
                    icon="fa-trophy"
                    items={resumeData?.achievements || []}
                    onChange={(newItems) => setResumeData({ ...resumeData, achievements: newItems })}
                  />
                  <ListManager
                    title="Languages"
                    icon="fa-language"
                    items={resumeData?.languages || []}
                    onChange={(newItems) => setResumeData({ ...resumeData, languages: newItems })}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Reusable UI Sub-components ---

const FormInput = ({ label, value, onChange }) => (
  <div>
    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">{label}</label>
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-5 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-cyan-500 transition-all font-s-16 shadow-inner"
      placeholder={`Enter ${label}...`}
    />
  </div>
);

const FormTextArea = ({ label, value, onChange, rows = 5 }) => (
  <div>
    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">{label}</label>
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full px-5 py-4 rounded-3xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-cyan-500 transition-all font-s-16 resize-none leading-relaxed"
      placeholder={`Express your ${label.toLowerCase()}...`}
    />
  </div>
);

const ListManager = ({ title, icon, items, onChange }) => (
  <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col h-full shadow-lg">
    <div className="flex items-center justify-between mb-6">
      <h3 className="font-bold text-white flex items-center gap-2">
        <i className={`fas ${icon} text-cyan-500 text-sm`}></i>
        {title}
      </h3>
      <button
        onClick={() => onChange([...items, ""])}
        className="text-[10px] font-bold text-zinc-500 hover:text-cyan-500 transition-colors uppercase tracking-widest"
      >
        Add Row
      </button>
    </div>

    <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-64">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 group/list">
          <input
            value={item}
            onChange={(e) => {
              const updated = [...items];
              updated[i] = e.target.value;
              onChange(updated);
            }}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-300 focus:border-cyan-500 focus:outline-none"
          />
          <button
            onClick={() => {
              const updated = items.filter((_, idx) => idx !== i);
              onChange(updated);
            }}
            className="text-zinc-700 hover:text-red-500 transition-colors"
          >
            <i className="fas fa-times-circle"></i>
          </button>
        </div>
      ))}
      {items.length === 0 && <p className="text-center py-6 text-zinc-700 text-xs italic">No items defined.</p>}
    </div>
  </div>
);

export default ResumeAdmin;