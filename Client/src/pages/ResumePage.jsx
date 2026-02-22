import './css/Resume.css'
import { useRef, useEffect } from 'react';
import useResume from '../hooks/useResume';
import { useResumeDownload } from '../hooks/useResumeDownload';
import ActiveResumeContent from '../components/ResumeTemplates/ActiveResumeContent';

const Resume = () => {
    const { resumeData, loading, error } = useResume();
    const resumeRef = useRef(null);
    const { isExporting, handleDownloadPDF, handleDownloadImage } = useResumeDownload(resumeRef, resumeData);

    // Auto-download listener
    useEffect(() => {
        if (!loading && !error && resumeData) {
            const params = new URLSearchParams(window.location.search);
            if (params.get('action') === 'download') {
                // Short timeout to ensure DOM is fully painted
                const timer = setTimeout(() => {
                    handleDownloadPDF();
                    // Clean up URL to prevent re-download on refresh
                    window.history.replaceState({}, document.title, window.location.pathname);
                }, 1000);
                return () => clearTimeout(timer);
            }
        }
    }, [loading, error, resumeData, handleDownloadPDF]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-zinc-500">Loading resume...</div>;
    }

    if (error || !resumeData) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">{error || "Resume not found."}</div>;
    }

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
                        <ActiveResumeContent ref={resumeRef} resumeData={resumeData} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Resume