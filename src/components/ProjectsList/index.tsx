import ProjectCard from "../ProjectCard";

const Projects = ({}) => {
  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      <div className="flex justify-between">
        <div className="font-bold text-[22px] leading-7">Your Projects</div>
      </div>
      <div className="flex flex-wrap gap-2">
        {filteredProjects.map((project, index) => (
          <ProjectCard
            key={index}
            title={project?.projectName}
            fundingWallet={project?.fundingWallet?.publicKey}
            maxSupply={project?.tokenDetails?.maxSupply}
            status={project?.status}
            adminWallet={project?.adminWallet?.publicKey}
            wallets={
              project?.beneficiaryDetails?.wallets ?
                project?.beneficiaryDetails?.wallets.reduce(
                  (total, wallet) => total + parseFloat(wallet?.amount),
                  0
                ) : 0
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Projects;
