import dynamic from 'next/dynamic';
import { SidebarWrapper } from '@/components/Sidebar/sidebar-wrapper';

const Header = dynamic(() => import('@/components/Header'), { ssr: false });

type DashLayoutProps = {
  children: React.ReactNode;
};

const DashLayout: React.FC<DashLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="flex h-screen justify-between">
        <SidebarWrapper>
          <Header />
          {children}
        </SidebarWrapper>
      </div>
    </>
  );
};

export default DashLayout;
