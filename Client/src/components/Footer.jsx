import { useEffect, useState } from "react";
import { ButtonPrimary } from "./Button";
import { NAV_LINKS } from "../constants/navigation";
import useResume from "../hooks/useResume";

const Footer = () => {
    const { resumeData } = useResume();
    const [socials, setSocials] = useState([]);

    useEffect(() => {
        if (resumeData?.contact) {
            const dynamicSocials = [];
            if (resumeData.contact.github && resumeData.contact.github.length > 0) {
                dynamicSocials.push({
                    label: "GitHub",
                    href: resumeData.contact.github[0].url
                });
            }
            if (resumeData.contact.linkedin && resumeData.contact.linkedin.length > 0) {
                dynamicSocials.push({
                    label: "LinkedIn",
                    href: resumeData.contact.linkedin[0].url
                });
            }
            // Fallback if no specific github/linkedin arrays but there are general links
            // We can add more logic here if needed, but the schema shows github and linkedin specifically
            setSocials(dynamicSocials);
        }
    }, [resumeData]);

    const sitemap = NAV_LINKS.filter(link => link.showInFooter);

    return (
        <>
            <footer className="section">
                <div className="container">
                    <div className="lg:grid lg:grid-cols-2">

                        <div className="mb-10">
                            <h2 className="headline-1 mb-8 lg:max-w-[12ch]">
                                Let's Work Together Today
                            </h2>

                            <ButtonPrimary
                                herf="mailto:daverudra489@gmail.com"
                                label="Start Project"
                                icon="chevron_right"
                                classes="reveal-up flex items-center"
                            />

                        </div>

                        <div className="grid grid-cols-2 gap-2 lg:pl-20">
                            <div>
                                <p className="mb-2 reveal-up">Sitemap</p>

                                <ul>
                                    {
                                        sitemap.map(({ label, href }, key) => (
                                            <li key={key}>
                                                <a href={href} className="block text-sm text-zinc-400 py-1 transition-colors hover:text-zinc-200 reveal-up">
                                                    {label}
                                                </a>
                                            </li>
                                        ))
                                    }
                                </ul>

                            </div>

                            <div>
                                <p className="mb-2">Socials</p>

                                <ul>
                                    {
                                        socials.map(({ label, href }, key) => (
                                            <li key={key}>
                                                <a href={href} target="_blank" className="block text-sm text-zinc-400 py-1 transition-colors hover:text-zinc-200">
                                                    {label}
                                                </a>
                                            </li>
                                        ))
                                    }
                                </ul>

                            </div>

                        </div>

                    </div>

                    <div className="flex items-center justify-between pt-10 mb-8">
                        <a href="" className="logo reveal-up">
                            <img src="/images/logo.svg" alt="Logo" height={40} width={40} className="" />
                        </a>
                        <p className="text-zinc-500 text-sm">
                            &copy; {new Date().getFullYear()} <span className="text-zinc-200">codeWithRD</span>
                        </p>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer;