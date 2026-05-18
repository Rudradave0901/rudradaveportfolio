import React, { useMemo } from "react";
import '../../pages/css/Resume.css';
import { resume2Icons } from "../../constants/commonIcons";
import { sortItemsByDate } from "../../utils/dtUtils";

/* Default page assignments if none saved yet */
const DEFAULT_PAGE_LAYOUT = {
    summary: 1, education: 1, experience: 1,
    skills: 2, projects: 2, achievements: 2,
};

const DEFAULT_SECTION_ORDER = [
    'summary', 'education', 'experience',
    'skills', 'projects', 'achievements',
];

const renderPoint = (text) => {
    if (!text) return null;
    const parts = text.split(/\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g);
    const result = [];
    for (let i = 0; i < parts.length; i += 3) {
        if (parts[i]) result.push(parts[i]);
        if (i + 1 < parts.length && i + 2 < parts.length) {
            result.push(
                <>
                    <a key={`l-${i}`} href={parts[i+2]} target="_blank" rel="noreferrer" style={{ color: '#0097CD', textDecoration: 'underline', fontWeight: '500' }}>
                        {parts[i+1]}
                    </a> &nbsp;
                </>
            );
        }
    }
    return result.length > 0 ? result : text;
};

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
        projects,
        achievements,
        pageLayout: rawPageLayout,
        sectionOrder: rawSectionOrder,
    } = resumeData;

    /* Normalise data from DB (may be Map, plain obj, or undefined) */
    const pageLayout = useMemo(() => {
        if (!rawPageLayout) return DEFAULT_PAGE_LAYOUT;
        if (rawPageLayout instanceof Map) return Object.fromEntries(rawPageLayout);
        return { ...DEFAULT_PAGE_LAYOUT, ...rawPageLayout };
    }, [rawPageLayout]);

    const sectionOrder = useMemo(() => {
        return rawSectionOrder?.length ? rawSectionOrder : DEFAULT_SECTION_ORDER;
    }, [rawSectionOrder]);

    const sortedExperience = useMemo(() => sortItemsByDate(experience), [experience]);
    const sortedEducation = useMemo(() => sortItemsByDate(education, 'year'), [education]);

    /* ─── Section Renderers ─── */
    const sectionRenderers = {
        summary: () => about && (
            <section key="summary">
                <h2 className="res-section-head"><img src={resume2Icons[4].user} alt={resume2Icons[4].user} /> Professional Summary</h2>
                <div className="res-summary" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {Array.isArray(about) ? about.map((para, i) => <p key={i} style={{ margin: 0 }}>{para}</p>) : <p style={{ margin: 0 }}>{about}</p>}
                </div>
            </section>
        ),

        education: () => education?.length > 0 && (
            <section key="education">
                <h2 className="res-section-head">
                    <img src={resume2Icons[10].education} alt={resume2Icons[10].education} className="h-3!" />
                    Education
                </h2>
                {sortedEducation.map((edu, idx) => (
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
        ),

        experience: () => experience?.length > 0 && (
            <section key="experience">
                <h2 className="res-section-head">
                    <img src={resume2Icons[5].work} alt={resume2Icons[5].work} /> 
                    Work Experience
                </h2>
                {sortedExperience.map((job, idx) => (
                    <div key={idx} className="res-item">
                        <div className="res-item-row">
                            <span className="res-item-name">{job.title}</span>
                            <span className="res-item-date">{job.startDate} — {job.endDate}</span>
                        </div>
                        <div className="res-item-sub">
                            <span>{job.companyName}</span>
                            <span style={{ fontWeight: 400, color: '#94a3b8' }}>{job.location}</span>
                        </div>
                        <ul className="res-list">
                            {job.points?.map((point, pIdx) => (
                                <li key={pIdx}>{renderPoint(point)}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>
        ),

        skills: () => (
            <section key="skills">
                <h2 className="res-section-head">
                    <img src={resume2Icons[6].skill} alt={resume2Icons[6].skill} /> 
                    Skills & Expertise
                </h2>
                {skills?.map((group, idx) => (
                    <div key={idx} className="res-skill-group">
                        <div className="res-skill-label">{group.title}</div>
                        <div className="res-skill-values">{group.items.join(" • ")}</div>
                    </div>
                ))}

            </section>
        ),

        projects: () => projects?.length > 0 && (
            <section key="projects">
                <h2 className="res-section-head">
                    <img src={resume2Icons[7].projects} alt={resume2Icons[7].projects} /> 
                    Projects
                </h2>
                {projects.map((proj, idx) => (
                    <div key={idx} className="res-item">
                        <div className="res-item-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '10px' }}>
                            <span className="res-item-name">{proj.title}</span>
                            {proj.inProgress && (
                                <span className="in-progress-badge relative" style={{ fontSize: '10px', color: '#475569', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>In Progress</span>
                            )}
                        </div>
                        <ul className="res-list" style={{ marginTop: '8px' }}>
                            {(proj.points || []).map((point, pIdx) => (
                                <li key={pIdx}>{renderPoint(point)}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>
        ),

        achievements: () => achievements?.length > 0 && (
            <section key="achievements">
                <h2 className="res-section-head"><img src={resume2Icons[9].achievements} alt={resume2Icons[9].achievements} /> Achievements</h2>
                <ul className="res-list">
                    {achievements.map((item, idx) => (
                        <li key={idx} style={{ marginBottom: '8px' }}>{item}</li>
                    ))}
                </ul>
            </section>
        ),
    };

    /* ─── Build pages ─── */
    const page1Sections = sectionOrder.filter(s => (pageLayout[s] || 1) === 1);
    const page2Sections = sectionOrder.filter(s => (pageLayout[s] || 1) === 2);

    /* Shared header component */
    const ResumeHeader = () => (
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
                    <a href={contact.portfolio} target="_blank" rel="noreferrer" className="res-contact-item text-[#0097CD]!">
                        <img src={resume2Icons[3].portfolio} alt={resume2Icons[3].portfolio} /> rudradave.in
                    </a>
                )}
            </div>
        </header>
    );

    return (
        <div className="res-body-wrapper" ref={ref}>
            {/* ── PAGE 1 ── */}
            <div className="res-container res-page" data-page="1">
                <ResumeHeader />
                {page1Sections.map(key => sectionRenderers[key]?.())}
            </div>

            {/* ── PAGE 2 (only if sections exist) ── */}
            {page2Sections.length > 0 && (
                <div className="res-container res-page" data-page="2">
                    {page2Sections.map(key => sectionRenderers[key]?.())}
                </div>
            )}
        </div>
    );
});

Resume2.displayName = 'Resume2';

export default Resume2;