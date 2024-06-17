import React, { useEffect, useMemo, useState } from 'react';
import { Tabs } from './Tabs';
import { AllTabsData } from './AllTabsData';
import { useStore } from '@/store';

interface ProjectsProps {
  projectData: any;
  projectId: string;
}

export const Projects: React.FC<ProjectsProps> = ({ projectData, projectId }) => {
  const [selectedTab, setSelectedTab] = useState<string>("Buy");
  const { allProjects, setAllProjects } = useStore();

  const currProject = useMemo(() => {
    if (!projectId) return null;
    return allProjects.find((project: any) => project?.projectId === projectId);
  }, [allProjects, projectId]);

  return (
    <div className='p-4'>
      <div>
        <Tabs setSelectedTab={setSelectedTab} />
      </div>
      <AllTabsData selectedTab={selectedTab} projectData={currProject} />
    </div>
  );
}
