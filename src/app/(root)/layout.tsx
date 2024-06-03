"use client"

import dynamic from 'next/dynamic';
import { SidebarWrapper } from '@/components/Sidebar/sidebar-wrapper';
import { useState } from 'react';

const Header = dynamic(() => import('@/components/Header'), { ssr: false });

type DashLayoutProps = {
  children: React.ReactNode;
};

const DashLayout: React.FC<DashLayoutProps> = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const handleSelectProject = (project: any) => {
    setSelectedProject(project);
  };

  return (
    <>
      <div className="flex h-full overflow-hidden justify-between scrollbar-hide">
        <SidebarWrapper onSelectProject={handleSelectProject}>
          <Header project={selectedProject} />
          {children}
        </SidebarWrapper>
      </div>
    </>
  );
};

export default DashLayout;
