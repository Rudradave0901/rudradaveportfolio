import useSkills from "../hooks/useSkills";

const BASE_URL = "https://rudradaveportfolio.onrender.com";

const Skills = () => {
  const { skills, loading, error } = useSkills();

  if (loading) return <div className="text-center py-20">Loading skills...</div>;
  if (error) return null;
  return (
    <section className="section" id="skills">
      <div className="container">

        <h2 className="section-title reveal-up">
          Essential <span>Tools</span> I use :
        </h2>

        <p className="text-zinc-400 mt-3 mb-8 max-w-[50ch] reveal-up font-s-16">
          Discover the powerful tools and technologies I use to create
          exceptional, high-performing websites & applications.
        </p>

        <div className="grid gap-3 grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))]">
          {skills.map((skill) => (
            <div key={skill._id} className="flex items-center gap-3 ring-2 ring-inset ring-zinc-50/10 rounded-2xl p-3">
              <figure className="w-12 h-12 p-2 bg-zinc-700/50 rounded-lg">
                <img src={`${BASE_URL}${skill.skillImageURL}`} alt={skill.skillName} width={32} height={32} />
              </figure>

              <div>
                <h3 className="font-s-16">{skill.skillName}</h3>
                <p className="text-zinc-400 font-s-14"> {skill.skillUse} </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Skills;