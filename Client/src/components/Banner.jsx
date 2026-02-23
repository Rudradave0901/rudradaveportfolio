import React, { useRef } from 'react'
import { ButtonOutline, ButtonPrimary } from './Button'
import useBanner from '../hooks/useBanner';
import '../pages/css/Resume.css';
import useResume from '../hooks/useResume';
import { useResumeDownload } from '../hooks/useResumeDownload';
import ActiveResumeContent from './ResumeTemplates/ActiveResumeContent';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const Banner = () => {
    const { bannerData, loading, error } = useBanner();

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (error) return null;

    return (
        <section id='home' className='pt-28 lg:pt-36 pb-20'>
            <div className="container items-center lg:grid lg:grid-cols-2 lg:gap-10">

                <div>
                    <div className="flex items-center gap-3">
                        <figure className='img-box w-9 h-9 rounded-lg'>
                            <img src={`${BASE_URL}${bannerData?.smallImageUrl}`} alt="Banner small Image" width={40} height={40} className='img-cover rounded-lg' />
                        </figure>

                        <div className="flex items-center gap-1.5 text-zinc-400 font-s-14 tracking-wide relative">
                            {/* Available for work */}
                            Hi, I'm Rudra Dave
                            <span className='absolute heroImg-wrap w-2 h-2 rounded-full bg-emeraid-400'>
                                <span className='absolute inset-0 rounded-full bg-emerald-400 animate-ping'></span>
                            </span>
                        </div>
                    </div>


                    {/* <h2 className="headline-1 mt-5 mb-8">
                    {bannerData?.name}
                </h2> */}

                    <h2 className='headline-1 max-w-[30ch] sm:max-w-[20ch] lg:max-w-[15ch] mt-5 mb-8 lg:mb-1'>
                        {bannerData?.headline}
                    </h2>

                    <div className="designation flex items-center gap-1.5 text-zinc-400 font-s-16">
                        {bannerData?.designations.map((item, index) => (
                            <React.Fragment key={index}>
                                <span>{item}</span>

                                {index !== bannerData.designations.length - 1 && (
                                    <div className="seprattor"></div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <ButtonPrimary
                            herf={'/resume?action=download'}
                            target={'_blank'}
                            label="Download CV"
                            iconImg="/images/downloadIcon.svg"
                            classes='flex align-center'
                        />

                        <ButtonOutline
                            herf={"#about"}
                            label={"Scroll down"}
                            iconImg="/images/bottomArrow.svg"
                            classes='flex align-center'
                        />

                    </div>
                </div>

                <div className="hidden lg:block">
                    <figure className='w-full max-w-[480px] ml-auto bg-gradient-to-t from-sky-400 via-25% via-sky-400 to-65% rounded-[60px] overflow-hidden'>
                        <img src={`${BASE_URL}${bannerData?.bannerImageUrl}`} alt="Banner Main Img" height={800} width={656} className='w-full' fetchPriority="high" />
                    </figure>
                </div>

            </div>
        </section>
    )
}

export default Banner