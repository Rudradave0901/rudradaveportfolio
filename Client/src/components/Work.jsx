import { Link } from "react-router-dom";
import useProjects from "../hooks/useProjects";

/* ======================================================
      Work Section
   ====================================================== */
const BASE_URL = import.meta.env.VITE_SERVER_URL;

const Work = () => {

  const { projects, loading, error } = useProjects();

  return (
    <section className="section min-h-screen scroll-mt-28" id="work">
      <div className="container">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 reveal-up">
          <h2 className="section-title">
            My <span>Portfolio</span> Latest Highlights :
          </h2>

          {projects.length > 0 && (
            <Link
              to="/projects"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline flex items-center gap-2 group"
            >
              View More Projects
              <span className="material-symbols-rounded group-hover:translate-x-1 transition-transform" aria-hidden="true">
                arrow_forward
              </span>
            </Link>
          )}
        </div>

        {error && (
          <div className="flex justify-center items-center h-40">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            {projects
              .filter(p => p.isVisible !== false && p.showOnHomepage === true)
              .sort((a, b) => {
                  if (a.homepageOrder !== b.homepageOrder) {
                      return a.homepageOrder - b.homepageOrder;
                  }
                  return new Date(b.createdAt) - new Date(a.createdAt);
              })
              .map((project, index) => {
              const isFeatured = index === 0;

              return (
                <div 
                  key={project._id || project.projectName} 
                  className={`relative p-5 rounded-3xl bg-zinc-900 border border-zinc-800/50 hover:border-sky-500/30 hover:shadow-2xl transition-all duration-300 group flex flex-col ${isFeatured ? 'md:col-span-2 md:flex-row gap-8' : 'gap-5'}`}
                >
                  {/* Image Container */}
                  <div className={`relative overflow-hidden rounded-2xl ${isFeatured ? 'md:w-[55%] h-64 md:h-full min-h-[300px]' : 'h-52 w-full'}`}>
                    <img
                      src={project.projectImageURL ? (project.projectImageURL.startsWith('http') ? project.projectImageURL : `${BASE_URL}${project.projectImageURL}`) : "/images/placeholder.svg"}
                      alt={project.projectName}
                      loading={isFeatured ? "eager" : "lazy"}
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    {isFeatured && (
                      <div className="absolute top-4 left-4 bg-sky-500 text-zinc-950 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                        <i className="fas fa-star text-[10px]"></i> Featured Project
                      </div>
                    )}
                    {project.isWorkInProgress && (
                      <div className={`absolute ${isFeatured ? 'top-4 right-4' : 'top-4 left-4'} bg-purple-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-purple-400`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> In Development
                      </div>
                    )}
                  </div>

                  {/* Content Container */}
                  <div className={`flex flex-col flex-1 ${isFeatured ? 'justify-center py-4 md:py-8' : ''}`}>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className={`font-bold text-white mb-2 group-hover:text-sky-400 transition-colors ${isFeatured ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                          {project.projectName}
                        </h3>
                        {/* Display description if available in DB, else fallback */}
                        <p className={`text-zinc-400 leading-relaxed ${isFeatured ? 'text-base md:text-lg mb-6' : 'text-sm mb-4 line-clamp-2'}`}>
                          {project.description || (isFeatured 
                            ? "A comprehensive full-stack application demonstrating complex state management, secure authentication, and scalable API architecture." 
                            : "A dynamic frontend application focusing on responsive design and seamless user experience.")}
                        </p>
                      </div>
                    </div>

                    {/* Tech Stack */}
                    {project.stack && Object.keys(project.stack).length > 0 && (
                      <div className="mb-6 space-y-3">
                        {Object.entries(project.stack).map(([group, items]) => (
                          items && items.length > 0 && (
                            <div key={group}>
                              <h4 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1.5 font-bold">
                                {group}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {items.map((tech) => (
                                  <span key={tech} className={`border border-zinc-700/50 bg-zinc-800/30 px-2.5 py-1 text-xs text-zinc-300 rounded-md font-medium ${isFeatured ? 'hover:bg-sky-500/10 hover:text-sky-400 hover:border-sky-500/30 transition-colors' : ''}`}>
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-auto pt-4 flex items-center gap-3 border-t border-zinc-800/50">
                      <a 
                        href={project.projectURL} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex-1 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold py-2.5 px-4 rounded-xl transition-all"
                      >
                        <span>View Live App</span>
                        <i className="fas fa-external-link-alt text-sm"></i>
                      </a>
                      <a 
                        href={project.githubURL || "#"} 
                        target={project.githubURL ? "_blank" : "_self"} 
                        rel={project.githubURL ? "noopener noreferrer" : ""} 
                        onClick={(e) => { if (!project.githubURL) e.preventDefault(); }}
                        className={`flex items-center justify-center w-11 h-11 bg-zinc-800 text-white rounded-xl transition-all border border-zinc-700 ${project.githubURL ? 'hover:bg-zinc-700' : 'opacity-50 cursor-not-allowed'}`}
                        title={project.githubURL ? "View Source Code" : "Source Code Access Not Allowed"}
                      >
                        <i className="fab fa-github text-lg"></i>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};


export default Work;
