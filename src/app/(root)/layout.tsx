import dynamic from 'next/dynamic';
const Header = dynamic(() => import('@/components/Header'), { ssr: false });

type DashLayoutProps = {
  children: React.ReactNode;
};

const DashLayout: React.FC<DashLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default DashLayout;
