import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const useResumeDownload = (resumeRef, resumeData) => {
    const [isExporting, setIsExporting] = useState(false);

    const handleDownloadPDF = async () => {
        if (!resumeRef.current || !resumeData) return;
        setIsExporting(true);
        try {
            resumeRef.current.classList.add("pdf-export");
            const canvas = await html2canvas(resumeRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
                windowWidth: 1200,
                // Removed scrollY: -window.scrollY which causes issues with off-screen elements
                // html2canvas v1+ handles scroll better when scrollY is not specified or set to 0
                scrollY: 0,
                onclone: (clonedDoc) => {
                    // 1. Process all elements to remove 'oklch' from inline/computed styles
                    const elements = clonedDoc.getElementsByTagName('*');
                    for (let i = 0; i < elements.length; i++) {
                        const el = elements[i];
                        const style = window.getComputedStyle(el);

                        ['color', 'backgroundColor', 'borderColor', 'fill', 'stroke', 'border-color', 'outline-color'].forEach(prop => {
                            const value = style[prop];
                            if (value && value.includes('oklch')) {
                                // Default fallbacks to prevent crash
                                if (prop.includes('color')) {
                                    if (el.classList.contains('text-indigo-600') || el.classList.contains('text-indigo-700')) {
                                        el.style.setProperty(prop, '#4f46e5', 'important');
                                    } else if (el.classList.contains('text-slate-900')) {
                                        el.style.setProperty(prop, '#0f172a', 'important');
                                    } else {
                                        el.style.setProperty(prop, '#333333', 'important');
                                    }
                                }
                                if (prop.includes('backgroundColor')) {
                                    if (el.classList.contains('bg-indigo-600')) {
                                        el.style.setProperty(prop, '#4f46e5', 'important');
                                    } else {
                                        el.style.setProperty(prop, '#ffffff', 'important');
                                    }
                                }
                                if (prop.includes('borderColor') || prop.includes('border-color')) {
                                    el.style.setProperty(prop, '#e2e8f0', 'important');
                                }
                            }
                        });

                        if (style.height === 'auto') {
                            el.style.height = el.offsetHeight + 'px';
                        }
                    }

                    // 2. Aggressively remove oklch from all style tags in the cloned doc
                    const styles = clonedDoc.getElementsByTagName('style');
                    for (let style of styles) {
                        if (style.innerHTML.includes('oklch')) {
                            // Replace all oklch colors with a safe hex value (indigo/slate mid-tones)
                            style.innerHTML = style.innerHTML.replace(/oklch\([^)]+\)/g, '#4f46e5');
                        }
                    }
                }
            });
            const imgData = canvas.toDataURL('image/png', 1.0);

            const pdfWidth = 210;
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [pdfWidth, pdfHeight]
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
                onclone: (clonedDoc) => {
                    // 1. Process all elements to remove 'oklch' from inline/computed styles
                    const elements = clonedDoc.getElementsByTagName('*');
                    for (let i = 0; i < elements.length; i++) {
                        const el = elements[i];
                        const style = window.getComputedStyle(el);

                        ['color', 'backgroundColor', 'borderColor', 'fill', 'stroke', 'border-color', 'outline-color'].forEach(prop => {
                            const value = style[prop];
                            if (value && value.includes('oklch')) {
                                // Default fallbacks to prevent crash
                                if (prop.includes('color')) {
                                    if (el.classList.contains('text-indigo-600') || el.classList.contains('text-indigo-700')) {
                                        el.style.setProperty(prop, '#4f46e5', 'important');
                                    } else if (el.classList.contains('text-slate-900')) {
                                        el.style.setProperty(prop, '#0f172a', 'important');
                                    } else {
                                        el.style.setProperty(prop, '#333333', 'important');
                                    }
                                }
                                if (prop.includes('backgroundColor')) {
                                    if (el.classList.contains('bg-indigo-600')) {
                                        el.style.setProperty(prop, '#4f46e5', 'important');
                                    } else {
                                        el.style.setProperty(prop, '#ffffff', 'important');
                                    }
                                }
                                if (prop.includes('borderColor') || prop.includes('border-color')) {
                                    el.style.setProperty(prop, '#e2e8f0', 'important');
                                }
                            }
                        });

                        if (style.height === 'auto') {
                            el.style.height = el.offsetHeight + 'px';
                        }
                    }

                    // 2. Aggressively remove oklch from all style tags in the cloned doc
                    const styles = clonedDoc.getElementsByTagName('style');
                    for (let style of styles) {
                        if (style.innerHTML.includes('oklch')) {
                            // Replace all oklch colors with a safe hex value (indigo/slate mid-tones)
                            style.innerHTML = style.innerHTML.replace(/oklch\([^)]+\)/g, '#4f46e5');
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

    return { isExporting, handleDownloadPDF, handleDownloadImage };
};
