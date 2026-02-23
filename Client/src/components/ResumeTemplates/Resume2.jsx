import React from "react";
import '../../pages/css/Resume.css';
import { resume2Icons } from "../../constants/commonIcons";

const Resume2 = React.forwardRef(({ resumeData }, ref) => {
    if (!resumeData) return null;

    const {
        profile,
        contact,
        skills,
        softSkills,
        languages,
        about,
        experience,
        education,
        achievements
    } = resumeData;

    return (
        <div className="res-body-wrapper">
            <div className="res-container" ref={ref}>
                {/* HEADER */}
                <header className="res-header">
                    <div className="res-title">
                        <h1>{profile?.name}</h1>
                        <p>{profile?.role}</p>
                    </div>
                    <div className="res-contact-grid">
                        {contact?.email && (
                            <a href={`mailto:${contact.email}`} className="res-contact-item">
                                <img src={resume2Icons[0].email} alt={resume2Icons[0].name} /> {contact.email}
                            </a>
                        )}
                        {contact?.phone && (
                            <div className="res-contact-item">
                                <img src={resume2Icons[1].phone} alt={resume2Icons[1].phone} /> {contact.phone}
                            </div>
                        )}
                        {contact?.location && (
                            <div className="res-contact-item">
                                <img src={resume2Icons[2].location} alt={resume2Icons[2].location} /> {contact.location}
                            </div>
                        )}
                        {contact?.portfolio && (
                            <a href={contact.portfolio} target="_blank" rel="noreferrer" className="res-contact-item">
                                <img src={resume2Icons[3].portfolio} alt={resume2Icons[3].portfolio} /> Portfolio
                            </a>
                        )}
                    </div>
                </header>

                {/* SUMMARY */}
                {about && (
                    <section>
                        <h2 className="res-section-head"><img src={resume2Icons[4].user} alt={resume2Icons[4].user} /> Professional Summary</h2>
                        <div className="res-summary">{about}</div>
                    </section>
                )}

                {/* WORK EXPERIENCE */}
                {experience?.length > 0 && (
                    <section>
                        <h2 className="res-section-head"><img src={resume2Icons[5].work} alt={resume2Icons[5].work} /> Work Experience</h2>
                        {experience.map((job, idx) => (
                            <div key={idx} className="res-item">
                                <div className="res-item-row">
                                    <span className="res-item-name">{job.title}</span>
                                    <span className="res-item-date">{job.startDate} — {job.endDate}</span>
                                </div>
                                <div className="res-item-sub">
                                    <span>{job.compenyName}</span>
                                    <span style={{ fontWeight: 400, color: '#94a3b8' }}>{job.location}</span>
                                </div>
                                <ul className="res-list">
                                    {job.points?.map((point, pIdx) => (
                                        <li key={pIdx}>{point}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>
                )}

                {/* EDUCATION */}
                {education?.length > 0 && (
                    <section>
                        <h2 className="res-section-head"><GraduationCap size={16} /> Education</h2>
                        {education.map((edu, idx) => (
                            <div key={idx} className="res-item">
                                <div className="res-item-row">
                                    <span className="res-item-name">{edu.degree}</span>
                                    <span className="res-item-date">{edu.year}</span>
                                </div>
                                <div className="res-item-sub">
                                    <span>{edu.school}</span>
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                {/* SKILLS & LANGUAGES (SIDE-BY-SIDE) */}
                <div className="res-split-grid">
                    <section>
                        <h2 className="res-section-head"><img src={resume2Icons[6].skill} alt={resume2Icons[6].skill} /> Skills & Expertise</h2>
                        {skills?.map((group, idx) => (
                            <div key={idx} className="res-skill-group">
                                <div className="res-skill-label">{group.title}</div>
                                <div className="res-skill-values">{group.items.join(" • ")}</div>
                            </div>
                        ))}
                        {softSkills?.length > 0 && (
                            <div className="res-skill-group">
                                <div className="res-skill-label">Soft Skills</div>
                                <div className="res-skill-values">{softSkills.join(" • ")}</div>
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="res-section-head"><img src={resume2Icons[7].languages} alt={resume2Icons[7].languages} /> Languages</h2>
                        <div style={{ marginTop: '5px' }}>
                            {languages?.map((lang, idx) => (
                                <span key={idx} className="res-lang-badge">{lang}</span>
                            ))}
                        </div>
                    </section>
                </div>

                {/* ACHIEVEMENTS (Sequential / Line-by-line) */}
                {achievements?.length > 0 && (
                    <section>
                        <h2 className="res-section-head"><img src={resume2Icons[8].achievements} alt={resume2Icons[8].achievements} /> Achievements</h2>
                        <ul className="res-list">
                            {achievements.map((item, idx) => (
                                <li key={idx} style={{ marginBottom: '8px' }}>{item}</li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </div>
    );
});

Resume2.displayName = 'Resume2';

export default Resume2;