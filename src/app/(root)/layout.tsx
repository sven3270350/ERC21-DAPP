"use client"

import dynamic from 'next/dynamic';
import { SidebarWrapper } from '@/components/Sidebar/sidebar-wrapper';
import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import { Project } from '@/types/project';

const Header = dynamic(() => import('@/components/Header'), { ssr: false });

type DashLayoutProps = {
  children: React.ReactNode;
};

const DashLayout: React.FC<DashLayoutProps> = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const handleSelectProject = (project: any) => {
    setSelectedProject(project);
  };
  const {allProjects, setAllProjects} = useStore();
  useEffect(() => {
    const data = localStorage.getItem("allProjects");
    if (data) {
      try {
        const parsedData: { [key: string]: Project }[] = JSON.parse(data);
        const projectsArray = parsedData.map((item) => Object.values(item)[0]);
        setAllProjects(projectsArray);
      } catch (error) {
        console.error("Error parsing JSON data:", error);
      }
    }
  }, []);
  return (
    <>
      <div className="flex justify-between h-full overflow-hidden scrollbar-hide">
        <SidebarWrapper onSelectProject={handleSelectProject}>
          <Header project={selectedProject} />
          {children}
        </SidebarWrapper>
      </div>
    </>
  );
};

export default DashLayout;
