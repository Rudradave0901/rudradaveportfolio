/**
 * Utility to process a cloned document during html2canvas export.
 * Specifically handles 'oklch' color fallbacks and height adjustments.
 * @param {Document} clonedDoc - The cloned document from html2canvas.
 */
export const processClonedDoc = (clonedDoc) => {
    // Create a temporary canvas to convert colors
    const canvas = clonedDoc.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const convertToHex = (colorStr) => {
        if (!colorStr || !colorStr.includes('oklch')) return colorStr;
        try {
            ctx.fillStyle = colorStr;
            const converted = ctx.fillStyle;
            // If it returns 'oklch' string (unsupported in some canvas contexts), use a fallback
            if (typeof converted === 'string' && converted.includes('oklch')) {
                return '#4f46e5';
            }
            return converted;
        } catch (e) {
            return '#4f46e5';
        }
    };

    // 1. Process all elements to move styles to inline hex (highest priority)
    const elements = clonedDoc.getElementsByTagName('*');
    const props = ['color', 'backgroundColor', 'borderColor', 'fill', 'stroke', 'outlineColor'];

    for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        const style = window.getComputedStyle(el);

        props.forEach(prop => {
            const value = style[prop];
            if (value && typeof value === 'string' && value.includes('oklch')) {
                el.style.setProperty(prop, convertToHex(value), 'important');
            }
        });

        // Fix potential height issues
        if (style.height === 'auto' && el.offsetHeight > 0) {
            el.style.height = el.offsetHeight + 'px';
        }

        if (el.tagName === 'IMG') {
            el.style.width = el.offsetWidth + 'px';
            el.style.height = el.offsetHeight + 'px';
        }
    }

    // 2. Process <style> tags to replace oklch (prevents crash in html2canvas parser)
    const styleTags = clonedDoc.getElementsByTagName('style');
    for (let i = 0; i < styleTags.length; i++) {
        const style = styleTags[i];
        if (style.innerHTML.includes('oklch')) {
            // Replace oklch(...) with a safe hex color
            style.innerHTML = style.innerHTML.replace(/oklch\([^)]+\)/g, '#4f46e5');
        }
    }

    // 3. Selectively handle <link> tags to preserve fonts/icons while avoiding oklch in main bundle
    const linkTags = Array.from(clonedDoc.getElementsByTagName('link'));
    linkTags.forEach(link => {
        if (link.rel === 'stylesheet') {
            const href = link.href || '';
            // If it's the main bundle (often /src/main.css or similar in dev, or a hashed name in prod)
            // and NOT a known safe resource like FontAwesome or Google Fonts
            if (!href.includes('font-awesome') && !href.includes('googleapis') && !href.includes('cdnjs')) {
                // In production, the main stylesheet will likely contain oklch from Tailwind v4.
                // html2canvas will crash on it. We must remove it and rely on the inline styles we set.
                link.remove();
            }
        }
    });

    // 4. Add global resets
    const overrideStyle = clonedDoc.createElement('style');
    overrideStyle.innerHTML = `
        * { box-sizing: border-box !important; }
        body { background-color: white !important; }
        /* Reset any lingering oklch variables */
        :root { 
            --tw-ring-color: #4f46e5 !important;
            --tw-shadow-color: rgba(0,0,0,0.1) !important;
        }
    `;
    clonedDoc.head.appendChild(overrideStyle);
};
