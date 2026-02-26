export const processClonedDoc = (clonedDoc) => {
    // 1. Force desktop layout dimensions in the cloned document
    const container = clonedDoc.querySelector('.resume-container-main');
    if (container) {
        container.style.width = '1200px';
        container.style.minWidth = '1200px';
        container.style.display = 'block';
    }

    clonedDoc.body.style.width = '1200px';
    clonedDoc.body.style.backgroundColor = 'white';

    // 2. Helper to convert OKLCH to Hex (Fallback)
    const canvas = document.createElement('canvas'); // Use original window's canvas for reliability
    const ctx = canvas.getContext('2d');
    const convertToHex = (colorStr) => {
        if (!colorStr || !colorStr.includes('oklch')) return colorStr;
        try {
            ctx.fillStyle = colorStr;
            const converted = ctx.fillStyle;
            if (typeof converted === 'string' && converted.includes('oklch')) {
                return '#4f46e5'; // Default indigo
            }
            return converted;
        } catch (e) {
            return '#4f46e5';
        }
    };

    // 3. Instead of removing stylesheets, inline them and replace oklch 
    // This preserves all layout and formatting.
    const linkTags = Array.from(clonedDoc.getElementsByTagName('link'));
    linkTags.forEach(link => {
        if (link.rel === 'stylesheet') {
            const href = link.href || '';
            // Only process main bundle/application styles
            if (!href.includes('font-awesome') && !href.includes('googleapis') && !href.includes('cdnjs')) {
                try {
                    // Find the original stylesheet in the main window
                    const sheet = Array.from(document.styleSheets).find(s => s.href === link.href);
                    if (sheet) {
                        let cssText = '';
                        try {
                            const rules = sheet.cssRules || sheet.rules;
                            if (rules) {
                                for (let i = 0; i < rules.length; i++) {
                                    cssText += rules[i].cssText + '\n';
                                }
                            }
                        } catch (e) {
                            // Cross-origin restriction might hit here, though shouldn't for local bundle
                            console.warn("Could not read cssRules for", href, e);
                        }

                        if (cssText) {
                            const styleTag = clonedDoc.createElement('style');
                            // Replace all oklch() occurrences in the CSS text
                            styleTag.innerHTML = cssText.replace(/oklch\([^)]+\)/g, (match) => convertToHex(match));
                            clonedDoc.head.appendChild(styleTag);
                            link.remove(); // Remove the link once replaced with safe inline CSS
                        }
                    }
                } catch (err) {
                    console.error("Failed to process stylesheet", href, err);
                }
            }
        }
    });

    // 4. Process existing <style> tags
    const styleTags = clonedDoc.getElementsByTagName('style');
    for (let i = 0; i < styleTags.length; i++) {
        const style = styleTags[i];
        if (style.innerHTML.includes('oklch')) {
            style.innerHTML = style.innerHTML.replace(/oklch\([^)]+\)/g, (match) => convertToHex(match));
        }
    }

    // 5. Final element pass for miscellaneous issues
    const elements = clonedDoc.getElementsByTagName('*');
    for (let i = 0; i < elements.length; i++) {
        const el = elements[i];

        // Ensure image dimensions are fixed
        if (el.tagName === 'IMG') {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0) el.style.width = rect.width + 'px';
            if (rect.height > 0) el.style.height = rect.height + 'px';
        }

        // Fix any remaining oklch in inline styles
        const inlineStyle = el.getAttribute('style');
        if (inlineStyle && inlineStyle.includes('oklch')) {
            el.setAttribute('style', inlineStyle.replace(/oklch\([^)]+\)/g, (match) => convertToHex(match)));
        }
    }
};
