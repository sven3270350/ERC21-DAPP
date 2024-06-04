import ProjectCard from "../ProjectCard";

const Projects = ({}) => {
  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      <div className="flex justify-between">
        <div className="font-bold text-[22px] leading-7">Your Projects</div>
      </div>
      <div className="flex flex-wrap gap-4">
        {[1, 2, 3].map((_, index) => (
          <ProjectCard key={index} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
