import React from 'react';
import '../../pages/css/Resume.css';

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
        achievements
    } = resumeData;

    return (
        <div className="resume-page-parent" ref={ref}>
            <div className="resume-page">
                {/* SIDEBAR (Left - Dark) */}
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

                            {softSkills?.length > 0 && (
                                <div className="skill-group">
                                    <div className="sidePanel-content-title">Soft Skills</div>
                                    <ul className="skill-tags">
                                        {softSkills.map((skill, i) => (
                                            <li className="skill-tag" key={i}>{skill}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
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

                {/* MAIN CONTENT (Right - White) */}
                <main className="right-content-wrapper">
                    <div className="section-contents-wrap">
                        <h2 className="section-title">About Me</h2>
                        <p className="objective-content">{about}</p>
                    </div>

                    <div className="section-contents-wrap">
                        <h2 className="section-title">Work Experience</h2>
                        {experience?.map((job, index) => (
                            <article className="job-card" key={index}>
                                <div className="job-title">{job.title} @ {job.compenyName} ( {job.location} ) | {job.startDate} - {job.endDate}</div>
                                <ul className="job-details">
                                    {job.points.map((point, i) => (
                                        <li key={i}>
                                            <img src="/images/icons/mark-icon.svg" alt="Mark Icon" height={15} width={15} />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        ))}
                    </div>

                    <div className="section-contents-wrap">
                        {achievements?.length > 0 && (
                            <>
                                <h2 className="section-title">Achievements</h2>
                                <ul className="job-details achievements-list">
                                    {achievements.map((item, i) => (
                                        <li key={i}>
                                            <img src="/images/icons/mark-icon.svg" alt="Mark Icon" height={15} width={15} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
});

Resume1.displayName = 'Resume1';

export default Resume1;
