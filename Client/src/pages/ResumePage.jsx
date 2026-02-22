import './css/Resume.css'
import { useRef, useState } from 'react';
import useResume from '../hooks/useResume';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Resume = () => {
    const { resumeData, loading, error } = useResume();
    const resumeRef = useRef(null);
    const [isExporting, setIsExporting] = useState(false);

    const handleDownloadPDF = async () => {
        if (!resumeRef.current) return;
        setIsExporting(true);
        try {
            resumeRef.current.classList.add("pdf-export");
            const canvas = await html2canvas(resumeRef.current, {
                scale: 2, // Moderate scale for large documents
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
                windowWidth: 1200,
                scrollY: -window.scrollY, // Fix for scrolled pages
                onclone: (clonedDoc) => {
                    const elements = clonedDoc.getElementsByTagName('*');
                    for (let i = 0; i < elements.length; i++) {
                        const el = elements[i];
                        const style = window.getComputedStyle(el);
                        ['color', 'backgroundColor', 'borderColor', 'fill', 'stroke'].forEach(prop => {
                            const value = style[prop];
                            if (value && (value.includes('oklch') || value.includes('var('))) {
                                if (prop === 'backgroundColor' && value.includes('oklch')) el.style.backgroundColor = '#ffffff';
                                if (prop === 'color' && value.includes('oklch')) el.style.color = '#333333';
                            }
                        });
                        if (style.height === 'auto') {
                            el.style.height = el.offsetHeight + 'px';
                        }
                    }
                    const styleTags = clonedDoc.getElementsByTagName('style');
                    for (let i = 0; i < styleTags.length; i++) {
                        if (styleTags[i].innerHTML.includes('oklch')) {
                            styleTags[i].innerHTML = styleTags[i].innerHTML.replace(/oklch\([^)]+\)/g, '#71717a');
                        }
                    }
                }
            });
            const imgData = canvas.toDataURL('image/png', 1.0);

            // Calculate PDF dimensions based on the captured canvas
            const pdfWidth = 210; // A4 width in mm
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [pdfWidth, pdfHeight] // Use custom format for long resumes
            });

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
            pdf.save(`${resumeData.profile.name.replace(/\s+/g, '_')}_Resume.pdf`);
        } catch (err) {
            console.error("PDF Export failed:", err);
        } finally {
            setIsExporting(false);
            resumeRef.current.classList.remove("pdf-export");
        }
    };

    const handleDownloadImage = async () => {
        if (!resumeRef.current) return;
        setIsExporting(true);
        try {
            resumeRef.current.classList.add("pdf-export");
            const canvas = await html2canvas(resumeRef.current, {
                scale: 3.5,
                useCORS: true,
                backgroundColor: "#ffffff",
                windowWidth: 1200,
                onclone: (clonedDoc) => {
                    const elements = clonedDoc.getElementsByTagName('*');
                    for (let i = 0; i < elements.length; i++) {
                        const el = elements[i];
                        const style = window.getComputedStyle(el);
                        ['color', 'backgroundColor', 'borderColor', 'fill', 'stroke'].forEach(prop => {
                            const value = style[prop];
                            if (value && value.includes('oklch')) {
                                if (prop === 'backgroundColor') el.style.backgroundColor = '#ffffff';
                                if (prop === 'color') el.style.color = '#333333';
                            }
                        });
                        if (style.height === 'auto') {
                            el.style.height = el.offsetHeight + 'px';
                        }
                    }
                    const styleTags = clonedDoc.getElementsByTagName('style');
                    for (let i = 0; i < styleTags.length; i++) {
                        if (styleTags[i].innerHTML.includes('oklch')) {
                            styleTags[i].innerHTML = styleTags[i].innerHTML.replace(/oklch\([^)]+\)/g, '#71717a');
                        }
                    }
                }
            });
            const link = document.createElement('a');
            link.download = `${resumeData.profile.name.replace(/\s+/g, '_')}_Resume.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
        } catch (err) {
            console.error("Image Export failed:", err);
        } finally {
            setIsExporting(false);
            resumeRef.current.classList.remove("pdf-export");
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-zinc-500">Loading resume...</div>;
    }

    if (error || !resumeData) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">{error || "Resume not found."}</div>;
    }

    const {
        profile,
        contact,
        skills,
        softSkills,
        languages,
        about,
        experience,
        projects,
        achievements
    } = resumeData;


    return (
        <>
            <div className="resume-container-main">
                <div className="container">
                    <div className="resume-export-controls" style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'flex-end', paddingTop: '20px' }}>
                        <button
                            onClick={handleDownloadPDF}
                            disabled={isExporting}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#0097CD',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            {isExporting ? 'Generating PDF...' : 'Download PDF'}
                        </button>
                        <button
                            onClick={handleDownloadImage}
                            disabled={isExporting}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#1a1a1a',
                                color: 'white',
                                border: '1px solid #333',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            {isExporting ? 'Generating PNG...' : 'Download PNG'}
                        </button>
                    </div>
                    <div className="viewport">
                        <div className="resume-page-parent" ref={resumeRef}>
                            <div className="resume-page">
                                {/* <!-- SIDEBAR (Left - Dark) --> */}
                                <aside className="sidePanel-main">
                                    {/* <!-- Name & Role --> */}
                                    <div className="profile-header">
                                        <h1 className="name">{profile.name}</h1>
                                        <span className="role">{profile.role}</span>
                                    </div>

                                    {/* <!-- Contact --> */}
                                    <section className="sidePanel-content-wrapper">
                                        {/* <!-- Contact --> */}
                                        <div className="content-wrapper">
                                            <div className="sidePanel-content-title">Connect</div>
                                            <ul className="contact-list">
                                                {contact.email && (
                                                    <li className='emailicon'>
                                                        <img src="/images/icons/mail-icon.svg" alt="mail icon" height={19} width={25} />
                                                        <a href={`mailto:${contact.email}`}>{contact.email}</a>
                                                    </li>
                                                )}

                                                {contact.phone && (
                                                    <li className='callicon'>
                                                        <img src="/images/icons/call-icon.svg" alt="call icon" height={23} width={23} />
                                                        <a href={`tel:${contact.phone.trim()}`}>{contact.phone}</a>
                                                    </li>
                                                )}
                                                {contact.linkedin.map((item, i) => (
                                                    <li className='linkedinicon' key={i}>
                                                        <img src="/images/icons/linkedin-icon.svg" alt="linkedin icon" height={20} width={20} />
                                                        <a href={item.url} target="_blank">{item.label}</a>
                                                    </li>
                                                ))}
                                                {contact.github.map((item, i) => (
                                                    <li className='githubicon' key={i}>
                                                        <img src="/images/icons/gitgub-icon.svg" alt="github icon" height={20} width={20} />
                                                        <a href={item.url}>{item.label}</a>
                                                    </li>
                                                ))}
                                                {contact.portfolio && (
                                                    <li className='portfolioicon'>
                                                        <img src="/images/icons/portfolio-icon.svg" alt="portfolio icon" height={20} width={20} />
                                                        <a href={contact.portfolio} target='_blank'>Portfolio.com</a>
                                                    </li>
                                                )}
                                                {contact.location && (
                                                    <li className='locationicon'>
                                                        <img src="/images/icons/location-icon.svg" alt="location icon" height={20} width={15} />
                                                        <span>{contact.location}</span>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>

                                        {/* <!-- Skills --> */}
                                        <div className="content-wrapper">
                                            {skills.map((group, index) => (
                                                <div className="skill-group" key={index}>
                                                    <div className="sidePanel-content-title">{group.title}</div>
                                                    <ul className="skill-tags">
                                                        {group.items.map((item, i) => (
                                                            <li className="skill-tag" key={i}>{item}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}

                                            {softSkills.length > 0 && (

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

                                        {/* <!-- Languages --> */}
                                        {languages.length > 0 && (
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

                                {/* <!-- MAIN CONTENT (Right - White) --> */}
                                <main className="right-content-wrapper">
                                    <div className="section-contents-wrap">
                                        <h2 className="section-title">About Me</h2>
                                        <p className="objective-content">{about}</p>
                                    </div>

                                    <div className="section-contents-wrap">
                                        <h2 className="section-title">Work Experience</h2>

                                        {experience.map((job, index) => (
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
                                        {achievements.length > 0 && (
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
                    </div>
                </div>
            </div>
        </>
    )
}

export default Resume