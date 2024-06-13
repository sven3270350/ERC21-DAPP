import React, { useEffect, useState } from 'react';
import { Tabs } from './Tabs';
import { AllTabsData } from './AllTabsData';

interface ProjectsProps {
  projectData: any;
}

export const Projects: React.FC<ProjectsProps> = ({ projectData }) => {
  const [selectedTab, setSelectedTab] = useState<string>("Buy");

  return (
    <div className='p-4'>
      <div>
        <Tabs setSelectedTab={setSelectedTab} />
      </div>
      <AllTabsData selectedTab={selectedTab} projectData={projectData} />
    </div>
  );
}
