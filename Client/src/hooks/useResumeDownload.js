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
        const pagesLinks = [];

        for (let i = 0; i < targets.length; i++) {
            const pageEl = targets[i];
            let currentLinks = [];

            const canvas = await html2canvas(pageEl, {
                scale: 2.5,
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
                windowWidth: 1200,
                scrollY: 0,
                onclone: (clonedDoc) => {
                    processClonedDoc(clonedDoc);
                    
                    const clonedPages = clonedDoc.querySelectorAll('.res-page');
                    const clonedPageEl = clonedPages.length > 0 ? clonedPages[i] : (clonedDoc.querySelector('.resume-container-main') || clonedDoc.body);
                    
                    if (clonedPageEl) {
                        const pageRect = clonedPageEl.getBoundingClientRect();
                        const links = clonedPageEl.querySelectorAll('a');
                        
                        links.forEach(a => {
                            const href = a.getAttribute('href');
                            if (href && (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel'))) {
                                const rect = a.getBoundingClientRect();
                                if (rect.width > 0 && rect.height > 0) {
                                    currentLinks.push({
                                        href,
                                        top: rect.top - pageRect.top,
                                        left: rect.left - pageRect.left,
                                        width: rect.width,
                                        height: rect.height,
                                        pageWidth: pageRect.width,
                                        pageHeight: pageRect.height
                                    });
                                }
                            }
                        });
                    }
                },
            });
            canvases.push(canvas);
            pagesLinks.push(currentLinks);
        }

        return { canvases, pagesLinks };
    };

    const handleDownloadPDF = async () => {
        if (!resumeRef.current || !resumeData) return;
        setIsExporting(true);
        try {
            resumeRef.current.classList.add("pdf-export");

            const { canvases, pagesLinks } = await capturePages(resumeRef.current);
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

                // Add links
                const links = pagesLinks[i];
                if (links) {
                    links.forEach(link => {
                        const scaleX = pdfWidth / link.pageWidth;
                        const scaleY = pdfHeight / link.pageHeight;
                        pdf.link(link.left * scaleX, link.top * scaleY, link.width * scaleX, link.height * scaleY, { url: link.href });
                    });
                }
            });

            const d = new Date();
            const formattedDate = `${String(d.getDate()).padStart(2, '0')}_${String(d.getMonth() + 1).padStart(2, '0')}_${String(d.getFullYear()).slice(-2)}`;
            pdf.save(`${resumeData.profile.name.replace(/\s+/g, '_')}_Resume_${formattedDate}.pdf`);
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
            const d = new Date();
            const formattedDate = `${String(d.getDate()).padStart(2, '0')}_${String(d.getMonth() + 1).padStart(2, '0')}_${String(d.getFullYear()).slice(-2)}`;
            link.download = `${resumeData.profile.name.replace(/\s+/g, '_')}_Resume_${formattedDate}.png`;
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

            const { canvases, pagesLinks } = await capturePages(resumeRef.current);
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

                // Add links
                const links = pagesLinks[i];
                if (links) {
                    links.forEach(link => {
                        const scaleX = pdfWidth / link.pageWidth;
                        const scaleY = pdfHeight / link.pageHeight;
                        pdf.link(link.left * scaleX, link.top * scaleY, link.width * scaleX, link.height * scaleY, { url: link.href });
                    });
                }
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
