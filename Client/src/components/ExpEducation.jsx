import useEduExp from '../hooks/useEduExp';

const ExpEducation = () => {
    const { eduExpData, loading, error } = useEduExp();

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (error) return null;

    return (
        <>
            <section className="section expEdu-section" id='resume'>
                <div className="container">
                    <div className="grid md:grid-cols-2">

                        <div className="px-2">
                            <h2 className="section-title mb-7 reveal-up">
                                My <span>Learning</span> Journey :
                            </h2>


                            <div className="rd-timeline art-gallery relative">
                                {eduExpData.map((doc) =>
                                    doc.education.map((educationData, index) => (
                                        <div key={index} className="rd-timeline-item relative">
                                            <div className="rd-timeline-mark-light"></div>
                                            <div className="rd-timeline-mark"></div>

                                            <div className="rd-timeline-content">
                                                <div className="rd-card-header flex-col lg:flex-row">
                                                    <div className="rd-left-side">
                                                        <h5 className="cardtitle">
                                                            {educationData.courseName}, {educationData.instituteName}
                                                        </h5>
                                                        <div className="art-el-suptitle text-zinc-500 mb-4">
                                                            {educationData.location}
                                                        </div>
                                                    </div>

                                                    <div className="art-right-side mb-4">
                                                        <span className="rd-date">
                                                            {educationData.startDate} - {educationData.endDate}
                                                        </span>
                                                    </div>
                                                </div>

                                                <ul>
                                                    {educationData.description.map((desc, i) => (
                                                        <li key={i} className="inner-text">
                                                            {desc}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="px-2">
                            <h2 className="section-title mb-7 reveal-up">
                                <span>Professional</span> Background :
                            </h2>

                            <div className="rd-timeline art-gallery relative">

                                {eduExpData.map((doc) =>
                                    doc.experience.map((experienceData, index) => (
                                        <div key={index} className="rd-timeline-item relative">
                                            <div className="rd-timeline-mark-light"></div>
                                            <div className="rd-timeline-mark"></div>

                                            <div className="rd-timeline-content">
                                                <div className="rd-card-header flex-col lg:flex-row">
                                                    <div className="rd-left-side">
                                                        <h5 className="cardtitle">
                                                            {experienceData.designation} @ {experienceData.companyName}
                                                        </h5>
                                                        <div className="art-el-suptitle text-zinc-500 mb-4">
                                                            {experienceData.location}
                                                        </div>
                                                    </div>

                                                    <div className="art-right-side mb-4">
                                                        <span className="rd-date">
                                                            {experienceData.startDate} - {experienceData.endDate}
                                                        </span>
                                                    </div>
                                                </div>

                                                <ul>
                                                    {experienceData.description.map((desc, i) => (
                                                        <li key={i} className="inner-text">
                                                            {desc}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ))
                                )}

                            </div>

                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}

export default ExpEducation