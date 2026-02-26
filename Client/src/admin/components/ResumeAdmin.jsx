import React, { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import useResume from '../../hooks/useResume';
import { useAuth } from '../../context/AuthContext';
import { isAdmin as checkIsAdmin } from '../../utils/authUtils';
import { useResumeDownload } from '../../hooks/useResumeDownload';
import ActiveResumeContent from '../../components/ResumeTemplates/ActiveResumeContent';
import ResumeService from '../../services/Resume.service';
import '../../pages/css/Resume.css';

const ResumeAdmin = () => {
  const { user } = useAuth();
  const isAdmin = checkIsAdmin(user);
  const { resumeData, loading, error, updateResume, createResume, setResumeData } = useResume();
  const [activeTab, setActiveTab] = useState("header");
  const [isSaving, setIsSaving] = useState(false);

  // PDF Generation Ref and Hook
  const resumeRef = useRef(null);
  const { generatePDFBlob } = useResumeDownload(resumeRef, resumeData);

  const handleUpdate = useCallback(async () => {
    if (!isAdmin) return;
    setIsSaving(true);

    try {
      const result = resumeData._id
        ? await updateResume(resumeData)
        : await createResume(resumeData);

      if (result.success) {
        // Automatically generate and upload PDF after successful save
        console.log("Generating updated PDF...");

        // Short delay to ensure any layout changes are reflected in the DOM
        setTimeout(async () => {
          try {
            const pdfBlob = await generatePDFBlob();
            if (pdfBlob) {
              const formData = new FormData();
              formData.append('resume', pdfBlob, 'resume.pdf');
              await ResumeService.uploadResumePDF(formData);
              console.log("PDF updated successfully on server.");
            }
          } catch (pdfErr) {
            console.error("Auto PDF update failed:", pdfErr);
          }
        }, 500);

        alert(result.message + "\n\nNote: PDF CV has been regenerated and is now active on the banner.");
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("An unexpected error occurred while saving.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }, [isAdmin, resumeData, updateResume, createResume, generatePDFBlob]);

  const navTabs = useMemo(() => [
    { id: 'header', label: 'Identity & About', icon: 'fa-user-circle' },
    { id: 'contact', label: 'Connections', icon: 'fa-address-book' },
    { id: 'skills', label: 'Professional Skills', icon: 'fa-layer-group' },
    { id: 'highlights', label: 'Highlights & Achievements', icon: 'fa-award' }
  ], []);

  if (loading && !resumeData) return <div className="p-10 text-center text-zinc-500">Loading Resume Data...</div>;

  return (
    <section id="resume-admin" className="content-section py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-zinc-800">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white">Resume Designer</h2>
              <p className="text-zinc-500 mt-1">Refine your professional narrative across all sections.</p>
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
          )}
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
                <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800">
                  <label className="block text-xs font-bold text-cyan-500 uppercase tracking-widest mb-4">Active Resume Design</label>
                  <div className="flex items-center gap-4">
                    <select
                      value={resumeData?.templateId || 'Resume1'}
                      onChange={(e) => isAdmin && setResumeData({ ...resumeData, templateId: e.target.value })}
                      disabled={!isAdmin}
                      className="flex-1 bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-all font-semibold"
                    >
                      <option value="Resume1">Modern Sidebar (Default)</option>
                      <option value="Resume2">Minimal Professional (New)</option>
                    </select>
                    <div className="text-zinc-500 text-sm italic">
                      This design will be visible on your /resume page and used for all downloads.
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Full Name"
                    value={resumeData?.profile?.name}
                    onChange={(v) => isAdmin && setResumeData({ ...resumeData, profile: { ...resumeData.profile, name: v } })}
                    readOnly={!isAdmin}
                  />
                  <FormInput
                    label="Professional Title"
                    value={resumeData?.profile?.role}
                    onChange={(v) => isAdmin && setResumeData({ ...resumeData, profile: { ...resumeData.profile, role: v } })}
                    readOnly={!isAdmin}
                  />
                </div>
                <FormTextArea
                  label="Professional Summary"
                  value={resumeData?.about}
                  onChange={(v) => isAdmin && setResumeData({ ...resumeData, about: v })}
                  rows={10}
                  readOnly={!isAdmin}
                />
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="Email Address" value={resumeData?.contact?.email} onChange={(v) => isAdmin && setResumeData({ ...resumeData, contact: { ...resumeData.contact, email: v } })} readOnly={!isAdmin} />
                  <FormInput label="Phone Number" value={resumeData?.contact?.phone} onChange={(v) => isAdmin && setResumeData({ ...resumeData, contact: { ...resumeData.contact, phone: v } })} readOnly={!isAdmin} />
                  <FormInput label="Location" value={resumeData?.contact?.location} onChange={(v) => isAdmin && setResumeData({ ...resumeData, contact: { ...resumeData.contact, location: v } })} readOnly={!isAdmin} />
                  <FormInput label="Portfolio Link" value={resumeData?.contact?.portfolio} onChange={(v) => isAdmin && setResumeData({ ...resumeData, contact: { ...resumeData.contact, portfolio: v } })} readOnly={!isAdmin} />
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {resumeData?.skills?.map((group, gi) => (
                  <div key={gi} className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 relative group/card">
                    {isAdmin && (
                      <button
                        onClick={() => {
                          const updated = resumeData.skills.filter((_, idx) => idx !== gi);
                          setResumeData({ ...resumeData, skills: updated });
                        }}
                        className="absolute top-4 right-4 text-zinc-600 hover:text-red-500 transition-colors"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    )}

                    <input
                      value={group.title}
                      onChange={(e) => {
                        if (!isAdmin) return;
                        const updated = [...resumeData.skills];
                        updated[gi].title = e.target.value;
                        setResumeData({ ...resumeData, skills: updated });
                      }}
                      readOnly={!isAdmin}
                      className={`bg-transparent text-xl font-bold text-white border-b border-zinc-800 ${isAdmin ? 'focus:border-cyan-500' : ''} focus:outline-none pb-2 mb-6 w-full max-w-sm`}
                      placeholder="Group Title (e.g. Frontend)"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {group.items.map((item, ii) => (
                        <div key={ii} className="flex items-center gap-2 group/item">
                          <input
                            value={item}
                            onChange={(e) => {
                              if (!isAdmin) return;
                              const updated = [...resumeData.skills];
                              updated[gi].items[ii] = e.target.value;
                              setResumeData({ ...resumeData, skills: updated });
                            }}
                            readOnly={!isAdmin}
                            className={`flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-300 ${isAdmin ? 'focus:border-cyan-500' : ''} focus:outline-none`}
                          />
                          {isAdmin && (
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
                          )}
                        </div>
                      ))}
                      {isAdmin && (
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
                      )}
                    </div>
                  </div>
                ))}

                {isAdmin && (
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
                )}
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
                    {isAdmin && (
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
                    )}
                  </div>

                  <div className="space-y-6">
                    {resumeData?.experience?.map((exp, ei) => (
                      <div key={ei} className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 group/exp">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <FormInput label="Company" value={exp.companyName} onChange={(v) => {
                            if (!isAdmin) return;
                            const updated = [...resumeData.experience];
                            updated[ei].companyName = v;
                            setResumeData({ ...resumeData, experience: updated });
                          }} readOnly={!isAdmin} />
                          <FormInput label="Role" value={exp.title} onChange={(v) => {
                            if (!isAdmin) return;
                            const updated = [...resumeData.experience];
                            updated[ei].title = v;
                            setResumeData({ ...resumeData, experience: updated });
                          }} readOnly={!isAdmin} />
                          <FormInput label="Location" value={exp.location} onChange={(v) => {
                            if (!isAdmin) return;
                            const updated = [...resumeData.experience];
                            updated[ei].location = v;
                            setResumeData({ ...resumeData, experience: updated });
                          }} readOnly={!isAdmin} />
                          <div className="grid grid-cols-2 gap-4">
                            <FormInput label="Start" value={exp.startDate} onChange={(v) => {
                              if (!isAdmin) return;
                              const updated = [...resumeData.experience];
                              updated[ei].startDate = v;
                              setResumeData({ ...resumeData, experience: updated });
                            }} readOnly={!isAdmin} />
                            <FormInput label="End" value={exp.endDate} onChange={(v) => {
                              if (!isAdmin) return;
                              const updated = [...resumeData.experience];
                              updated[ei].endDate = v;
                              setResumeData({ ...resumeData, experience: updated });
                            }} readOnly={!isAdmin} />
                          </div>
                        </div>

                        <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2 ml-1">Key Contributions</label>
                        <div className="space-y-2 mb-4">
                          {exp.points.map((pt, pi) => (
                            <div key={pi} className="flex gap-2">
                              <input
                                value={pt}
                                onChange={(e) => {
                                  if (!isAdmin) return;
                                  const updated = [...resumeData.experience];
                                  updated[ei].points[pi] = e.target.value;
                                  setResumeData({ ...resumeData, experience: updated });
                                }}
                                readOnly={!isAdmin}
                                className={`flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-300 ${isAdmin ? 'focus:border-cyan-500' : ''} focus:outline-none`}
                              />
                              {isAdmin && (
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
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          {isAdmin ? (
                            <>
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
                            </>
                          ) : (
                            <span className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest italic">Read Only Section</span>
                          )}
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
                    onChange={(newItems) => isAdmin && setResumeData({ ...resumeData, achievements: newItems })}
                    readOnly={!isAdmin}
                  />
                  <ListManager
                    title="Languages"
                    icon="fa-language"
                    items={resumeData?.languages || []}
                    onChange={(newItems) => isAdmin && setResumeData({ ...resumeData, languages: newItems })}
                    readOnly={!isAdmin}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden Resume Component for PDF Generation */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', pointerEvents: 'none' }}>
        <div className="resume-container-main" style={{ width: '1200px', background: 'white' }}>
          <ActiveResumeContent ref={resumeRef} resumeData={resumeData} />
        </div>
      </div>
    </section>
  );
};

// --- Memoized UI Sub-components ---

const FormInput = memo(({ label, value, onChange, readOnly }) => (
  <div>
    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">{label}</label>
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      readOnly={readOnly}
      className={`w-full px-5 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none ${!readOnly ? 'focus:border-cyan-500' : ''} transition-all font-s-16 shadow-inner`}
      placeholder={readOnly ? "None" : `Enter ${label}...`}
    />
  </div>
));

const FormTextArea = memo(({ label, value, onChange, rows = 5, readOnly }) => (
  <div>
    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">{label}</label>
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      readOnly={readOnly}
      className={`w-full px-5 py-4 rounded-3xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none ${!readOnly ? 'focus:border-cyan-500' : ''} transition-all font-s-16 resize-none leading-relaxed`}
      placeholder={readOnly ? "No content." : `Express your ${label.toLowerCase()}...`}
    />
  </div>
));

const ListManager = memo(({ title, icon, items, onChange, readOnly }) => (
  <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col h-full shadow-lg">
    <div className="flex items-center justify-between mb-6">
      <h3 className="font-bold text-white flex items-center gap-2">
        <i className={`fas ${icon} text-cyan-500 text-sm`}></i>
        {title}
      </h3>
      {!readOnly && (
        <button
          onClick={() => onChange([...items, ""])}
          className="text-[10px] font-bold text-zinc-500 hover:text-cyan-500 transition-colors uppercase tracking-widest"
        >
          Add Row
        </button>
      )}
    </div>

    <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-64">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 group/list">
          <input
            value={item}
            onChange={(e) => {
              if (readOnly) return;
              const updated = [...items];
              updated[i] = e.target.value;
              onChange(updated);
            }}
            readOnly={readOnly}
            className={`flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-300 ${!readOnly ? 'focus:border-cyan-500' : ''} focus:outline-none`}
          />
          {!readOnly && (
            <button
              onClick={() => {
                const updated = items.filter((_, idx) => idx !== i);
                onChange(updated);
              }}
              className="text-zinc-700 hover:text-red-500 transition-colors"
            >
              <i className="fas fa-times-circle"></i>
            </button>
          )}
        </div>
      ))}
      {items.length === 0 && <p className="text-center py-6 text-zinc-700 text-xs italic">No items defined.</p>}
    </div>
  </div>
));

export default ResumeAdmin;