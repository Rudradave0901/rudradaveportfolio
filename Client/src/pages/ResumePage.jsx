import './css/Resume.css'
import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useResume from '../hooks/useResume';
import { useResumeDownload } from '../hooks/useResumeDownload';
import ActiveResumeContent from '../components/ResumeTemplates/ActiveResumeContent';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const Resume = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');

    const { resumeData, loading, error } = useResume(true, id);
    const resumeRef = useRef(null);
    const { isExporting, handleDownloadPDF, handleDownloadImage } = useResumeDownload(resumeRef, resumeData);



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
                                textDecoration: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                display: 'inline-block',
                                border: 'none'
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