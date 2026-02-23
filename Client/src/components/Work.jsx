import useProjects from "../hooks/useProjects";

/* ======================================================
      Work Section
   ====================================================== */
const Work = () => {

  const { projects, loading, error } = useProjects();

  return (
    <section className="section min-h-screen scroll-mt-28" id="work">
      <div className="container">

        <h2 className="section-title mb-7 reveal-up">
          My <span>Portfolio</span> Highlights :
        </h2>

        {loading && (
          <div className="flex justify-center items-center h-40">
            <p className="text-zinc-400">Loading projects...</p>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center h-40">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-x-4 gap-y-5 grid-cols-[repeat(auto-fill,_minmax(280px,1fr))]">
            {projects.map((project) => (
              <div key={project._id || project.projectName} className={`relative p-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700/50 active:bg-zinc-700/60 ring-1 ring-inset ring-zinc-50/5 transition-colors`}>
                <article className="rounded-2xl p-2">

                  <img
                    src={`https://rudradaveportfolio.onrender.com${project.projectImageURL}`}
                    alt={project.projectName}
                    className="h-44 w-full rounded-xl object-cover"
                  />

                  <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">
                        {project.projectName}
                      </h3>

                      {/* Tech Stack */}
                      {project.stack && Object.keys(project.stack).length > 0 && (
                        <div className="mt-3 space-y-3">
                          {Object.entries(project.stack).map(([group, items]) => (
                            <div key={group}>
                              <h4 className="mb-2 text-xs uppercase tracking-wider text-zinc-500">
                                {group} :
                              </h4>

                              <div className="flex flex-wrap gap-2">
                                {items.map((tech) => (
                                  <span key={tech} className="rounded-md border border-zinc-700/60 bg-zinc-800/60 px-2.5 py-0.5 text-xs text-zinc-300 hover:border-sky-400 hover:text-sky-400 transition-colors">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* External link */}
                    <a href={project.projectURL} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.projectName}`} className="mt-3 sm:mt-0 sm:ml-4 flex h-11 w-11  items-center justify-center rounded-lg  bg-sky-500 text-zinc-950 hover:bg-sky-400 transition-colors" >
                      <span className="material-symbols-rounded" aria-hidden="true" >
                        arrow_outward
                      </span>
                    </a>
                  </div>

                </article>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};


export default Work;
