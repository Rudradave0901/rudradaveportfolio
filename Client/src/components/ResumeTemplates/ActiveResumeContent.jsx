import React from 'react';
import Resume1 from './Resume1';
import Resume2 from './Resume2';
// In the future, import Resume2 from './Resume2', etc.

const ActiveResumeContent = React.forwardRef(({ resumeData }, ref) => {
    if (!resumeData) return null;

    // Use the templateId from the database. Default to 'Resume1' if missing.
    const activeTemplate = resumeData.templateId || 'Resume1';

    // Dynamically render the correct template based on the string
    switch (activeTemplate) {
        case 'Resume1':
            return <Resume1 ref={ref} resumeData={resumeData} />;
        case 'Resume2':
            return <Resume2 ref={ref} resumeData={resumeData} />;
        default:
            return <Resume1 ref={ref} resumeData={resumeData} />;
    }
});

ActiveResumeContent.displayName = 'ActiveResumeContent';

export default ActiveResumeContent;
