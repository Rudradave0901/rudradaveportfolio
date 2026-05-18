import React, { useMemo } from 'react';
import '../../pages/css/Resume.css';
import { sortItemsByDate } from '../../utils/dtUtils';

/* Default page assignments if none saved yet */
const DEFAULT_PAGE_LAYOUT = {
    summary: 1, education: 1, experience: 1,
    skills: 1, projects: 2, achievements: 2,
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
                <a key={`l-${i}`} href={parts[i+2]} target="_blank" rel="noreferrer" style={{ color: '#0097CD', textDecoration: 'underline', fontWeight: '500' }}>
                    {parts[i+1]}
                </a>
            );
        }
    }
    return result.length > 0 ? result : text;
};

const Resume1 = React.forwardRef(({ resumeData }, ref) => {
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

    /* Normalise data from DB */
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

    /* ─── Section Renderers (Right Panel) ─── */
    const sectionRenderers = {
        summary: () => about && (
            <div className="section-contents-wrap" key="summary">
                <h2 className="section-title">About Me</h2>
                <div className="objective-content" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {Array.isArray(about) ? about.map((para, i) => <p key={i} style={{ margin: 0 }}>{para}</p>) : <p style={{ margin: 0 }}>{about}</p>}
                </div>
            </div>
        ),

        education: () => education?.length > 0 && (
            <div className="section-contents-wrap" key="education">
                <h2 className="section-title">Education</h2>
                {sortedEducation.map((edu, index) => (
                    <article className="job-card" key={index}>
                        <div className="job-title">{edu.degree} | {edu.year}</div>
                        <div style={{ color: '#64748b', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>{edu.school}</div>
                    </article>
                ))}
            </div>
        ),

        experience: () => sortedExperience?.length > 0 && (
            <div className="section-contents-wrap" key="experience">
                <h2 className="section-title">Work Experience</h2>
                {sortedExperience.map((job, index) => (
                    <article className="job-card" key={index}>
                        <div className="job-title">{job.title} @ {job.companyName} ( {job.location} ) | {job.startDate} - {job.endDate}</div>
                        <ul className="job-details">
                            {job.points.map((point, i) => (
                                <li key={i}>
                                    <img src="/images/icons/mark-icon.svg" alt="Mark Icon" height={15} width={15} />
                                    {renderPoint(point)}
                                </li>
                            ))}
                        </ul>
                    </article>
                ))}
            </div>
        ),

        projects: () => projects?.length > 0 && (
            <div className="section-contents-wrap" key="projects">
                <h2 className="section-title">Projects</h2>
                {projects.map((proj, index) => (
                    <article className="job-card" key={index}>
                        <div className="job-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {proj.title}
                            {proj.inProgress && (
                                <span style={{ fontSize: '11px', backgroundColor: '#e2e8f0', color: '#475569', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>In Progress</span>
                            )}
                        </div>
                        <ul className="job-details">
                            {(proj.points || []).map((point, i) => (
                                <li key={i}>
                                    <img src="/images/icons/mark-icon.svg" alt="Mark Icon" height={15} width={15} />
                                    {renderPoint(point)}
                                </li>
                            ))}
                        </ul>
                    </article>
                ))}
            </div>
        ),

        achievements: () => achievements?.length > 0 && (
            <div className="section-contents-wrap" key="achievements">
                <h2 className="section-title">Achievements</h2>
                <ul className="job-details achievements-list">
                    {achievements.map((item, i) => (
                        <li key={i}>
                            <img src="/images/icons/mark-icon.svg" alt="Mark Icon" height={15} width={15} />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        ),

        /* Skills are rendered in the sidebar, so this is a no-op for right panel */
        skills: () => null,
    };

    /* ─── Build pages ─── */
    const page1Sections = sectionOrder.filter(s => (pageLayout[s] || 1) === 1 && s !== 'skills');
    const page2Sections = sectionOrder.filter(s => (pageLayout[s] || 1) === 2 && s !== 'skills');

    /* Shared Sidebar component */
    const Sidebar = () => (
        <aside className="sidePanel-main">
            <div className="profile-header">
                <h1 className="name">{profile?.name}</h1>
                <span className="role">{profile?.role}</span>
            </div>

            <section className="sidePanel-content-wrapper">
                <div className="content-wrapper">
                    <div className="sidePanel-content-title">Connect</div>
                    <ul className="contact-list">
                        {contact?.email && (
                            <li className='emailicon'>
                                <img src="/images/icons/mail-icon.svg" alt="mail icon" height={19} width={25} />
                                <a href={`mailto:${contact.email}`}>{contact.email}</a>
                            </li>
                        )}

                        {contact?.phone && (
                            <li className='callicon'>
                                <img src="/images/icons/call-icon.svg" alt="call icon" height={23} width={23} />
                                <a href={`tel:${contact.phone.trim()}`}>{contact.phone}</a>
                            </li>
                        )}
                        {contact?.linkedin?.map((item, i) => (
                            <li className='linkedinicon' key={i}>
                                <img src="/images/icons/linkedin-icon.svg" alt="linkedin icon" height={20} width={20} />
                                <a href={item.url} target="_blank" rel="noopener noreferrer">{item.label}</a>
                            </li>
                        ))}
                        {contact?.github?.map((item, i) => (
                            <li className='githubicon' key={i}>
                                <img src="/images/icons/gitgub-icon.svg" alt="github icon" height={20} width={20} />
                                <a href={item.url} target="_blank" rel="noopener noreferrer">{item.label}</a>
                            </li>
                        ))}
                        {contact?.portfolio && (
                            <li className='portfolioicon'>
                                <img src="/images/icons/portfolio-icon.svg" alt="portfolio icon" height={20} width={20} />
                                <a href={contact.portfolio} target='_blank' rel="noopener noreferrer">Portfolio.com</a>
                            </li>
                        )}
                        {contact?.location && (
                            <li className='locationicon'>
                                <img src="/images/icons/location-icon.svg" alt="location icon" height={20} width={15} />
                                <span>{contact.location}</span>
                            </li>
                        )}
                    </ul>
                </div>

                <div className="content-wrapper">
                    {skills?.map((group, index) => (
                        <div className="skill-group" key={index}>
                            <div className="sidePanel-content-title">{group.title}</div>
                            <ul className="skill-tags">
                                {group.items.map((item, i) => (
                                    <li className="skill-tag" key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}


                </div>

                {languages?.length > 0 && (
                    <div className="content-wrapper">
                        <div className="sidePanel-content-title">Languages</div>
                        <ul className="skill-tags">
                            {languages.map((lang, i) => (
                                <li className="skill-tag" key={i}>{lang}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>
        </aside>
    );

    return (
        <div className="resume-page-parent" ref={ref}>
            {/* ── PAGE 1 ── */}
            <div className="resume-page res-page" data-page="1">
                <Sidebar />
                <main className="right-content-wrapper">
                    {page1Sections.map(key => sectionRenderers[key]?.())}
                </main>
            </div>

            {/* ── PAGE 2 (only if sections assigned) ── */}
            {page2Sections.length > 0 && (
                <div className="resume-page res-page res-page-2-full" data-page="2">
                    <main className="right-content-wrapper" style={{ gridColumn: '1 / -1' }}>
                        {page2Sections.map(key => sectionRenderers[key]?.())}
                    </main>
                </div>
            )}
        </div>
    );
});

Resume1.displayName = 'Resume1';

export default Resume1;
