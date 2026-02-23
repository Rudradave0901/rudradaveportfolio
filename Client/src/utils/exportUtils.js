/**
 * Utility to process a cloned document during html2canvas export.
 * Specifically handles 'oklch' color fallbacks and height adjustments.
 * @param {Document} clonedDoc - The cloned document from html2canvas.
 */
export const processClonedDoc = (clonedDoc) => {
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
};
