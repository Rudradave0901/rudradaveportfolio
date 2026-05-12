import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { processClonedDoc } from '../utils/exportUtils';

export const useResumeDownload = (resumeRef, resumeData) => {
    const [isExporting, setIsExporting] = useState(false);

    /**
     * Capture each .res-page element separately and produce
     * a multi-page A4 PDF.
     */
    const capturePages = async (element) => {
        const pages = element.querySelectorAll('.res-page');
        // Fallback: if no .res-page containers, treat the whole element as one page
        const targets = pages.length > 0 ? Array.from(pages) : [element];
        const canvases = [];

        for (const pageEl of targets) {
            const canvas = await html2canvas(pageEl, {
                scale: 4,
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
                windowWidth: 1200,
                scrollY: 0,
                onclone: (clonedDoc) => processClonedDoc(clonedDoc),
            });
            canvases.push(canvas);
        }

        return canvases;
    };

    const handleDownloadPDF = async () => {
        if (!resumeRef.current || !resumeData) return;
        setIsExporting(true);
        try {
            resumeRef.current.classList.add("pdf-export");

            const canvases = await capturePages(resumeRef.current);
            const pdfWidth = 210; // A4 width in mm

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            canvases.forEach((canvas, i) => {
                if (i > 0) pdf.addPage('a4', 'portrait');
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                const imgData = canvas.toDataURL('image/png', 1.0);
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
            });

            pdf.save(`${resumeData.profile.name.replace(/\s+/g, '_')}_Resume.pdf`);
        } catch (err) {
            console.error("PDF Export failed:", err);
        } finally {
            setIsExporting(false);
            resumeRef.current.classList.remove("pdf-export");
        }
    };

    const handleDownloadImage = async () => {
        if (!resumeRef.current || !resumeData) return;
        setIsExporting(true);
        try {
            resumeRef.current.classList.add("pdf-export");
            const canvas = await html2canvas(resumeRef.current, {
                scale: 3.5,
                useCORS: true,
                backgroundColor: "#ffffff",
                windowWidth: 1200,
                scrollY: 0,
                onclone: (clonedDoc) => processClonedDoc(clonedDoc)
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

    const generatePDFBlob = async () => {
        if (!resumeRef.current || !resumeData) return null;
        try {
            resumeRef.current.classList.add("pdf-export");

            const canvases = await capturePages(resumeRef.current);
            const pdfWidth = 210;

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            canvases.forEach((canvas, i) => {
                if (i > 0) pdf.addPage('a4', 'portrait');
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                const imgData = canvas.toDataURL('image/png', 1.0);
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
            });

            return pdf.output('blob');
        } catch (err) {
            console.error("PDF Blob generation failed:", err);
            return null;
        } finally {
            resumeRef.current.classList.remove("pdf-export");
        }
    };

    return { isExporting, handleDownloadPDF, handleDownloadImage, generatePDFBlob };
};
