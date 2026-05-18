const BASE_URL = import.meta.env.VITE_SERVER_URL;

const ProjectCard = ({ project }) => {
    return (
        <div className="project-card group relative bg-zinc-800/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-zinc-700/50 flex flex-col h-full">
            {/* Image Container */}
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={project.projectImageURL ? (project.projectImageURL.startsWith('http') ? project.projectImageURL : `${BASE_URL}${project.projectImageURL}`) : 'https://via.placeholder.com/400x225'}
                    alt={project.projectName}
                    loading="lazy"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white text-xs font-medium bg-sky-500/80 px-2 py-1 rounded-md">{(project.categories && project.categories.length > 0) ? project.categories[0] : project.category}</span>
                </div>
                {project.isWorkInProgress && (
                    <div className="absolute top-3 left-3 bg-purple-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg flex items-center gap-1.5 border border-purple-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> In Development
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">
                    {project.projectName}
                </h3>

                <p className="text-zinc-400 text-sm line-clamp-2 mb-4">
                    {project.description ? (() => {
                        const text = project.description;
                        const parts = text.split(/\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g);
                        const result = [];
                        for (let i = 0; i < parts.length; i += 3) {
                            if (parts[i]) result.push(parts[i]);
                            if (i + 1 < parts.length && i + 2 < parts.length) {
                                result.push(
                                    <a key={`l-${i}`} href={parts[i+2]} target="_blank" rel="noreferrer" style={{ color: '#0ea5e9', textDecoration: 'underline', fontWeight: '500' }}>
                                        {parts[i+1]}
                                    </a>
                                );
                            }
                        }
                        return result;
                    })() : "A professional project built with modern technologies."}
                </p>

                {/* Stack Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {project.stack?.tags?.slice(0, 3).map((tag, index) => (
                        <span
                            key={index}
                            className="px-2 py-0.5 border border-zinc-700/60 bg-zinc-800/60 text-zinc-300 text-[10px] font-semibold rounded-md whitespace-nowrap"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Action Button */}
                <div className="mt-auto">
                    <a
                        href={project.projectURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-2 bg-sky-500 hover:bg-sky-400 text-zinc-950 font-semibold rounded-lg transition-colors group-hover:shadow-lg group-hover:shadow-sky-500/20"
                    >
                        View Project
                        <span className="material-symbols-rounded ml-2 group-hover:translate-x-1 transition-transform">
                            arrow_outward
                        </span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
