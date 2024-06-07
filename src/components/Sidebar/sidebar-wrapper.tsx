import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useState, useEffect } from "react";
import { MdOutlineDashboard } from "react-icons/md";
import { GoProjectRoadmap } from "react-icons/go";
import Sidebarheader from "./sidebar-header";
import Image from "next/image";
import { Project } from "@/types/project";
import { useRouter } from "next/navigation";

interface SidebarWrapperProps {
    children: React.ReactNode;
    onSelectProject: (project: Project | null) => void;
}

export const SidebarWrapper: React.FC<SidebarWrapperProps> = ({
    children,
    onSelectProject,
}) => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isRenderable, setIsRenderable] = useState<boolean>(false);
    const [collapse, setCollapse] = useState<boolean>(false);
    const [toggleState, setToggleState] = useState<boolean>(false);
    const [isMdBreakpoint, setIsMdBreakpoint] = useState<boolean>(false);
    const [activeMenu, setActiveMenu] = useState<string>("Dashboard");
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const data = localStorage.getItem('projectData');
        const parsedData: Record<string, any> = data ? JSON.parse(data) : {};
        const projectsArray = Object.values(parsedData) as Project[];
        setProjects(projectsArray);
    }, []);

    const handleMenuItemClick = (selectedPage: string, project: Project | null = null) => {
        let routePath = "/";

        switch (selectedPage) {
            case "Dashboard":
                routePath = "/dashboard";
                break;
            case "Projects":
                if (project) {
                    setSelectedProject(project);
                    onSelectProject(project);
                    routePath = `/projects`;
                } else {
                    setSelectedProject(null);
                    onSelectProject(null);
                    routePath = "/projects";
                }
                break;
            default:
                routePath = "/";
                break;
        }
        setActiveMenu(selectedPage);

        if (routePath !== "/") {
            router.push(routePath);
        }

        setToggleState(false);
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("resize", handleResizeWindow);
            handleResizeWindow();
            setIsRenderable(true);
            return () => window.removeEventListener("resize", handleResizeWindow);
        }
    }, []);

    const handleResizeWindow = () => {
        if (window.innerWidth <= 768) {
            setCollapse(false);
            setIsMdBreakpoint(true);
        } else {
            setCollapse(true);
            setIsMdBreakpoint(false);
        }
    };

    const isSelectedMenuItem = (type: string) => {
        return type === activeMenu;
    };

    const getMenuItemSelectedColor = (type: string) => {
        return isSelectedMenuItem(type) ? "#F57C00" : "#52525B";
    };

    return (
        <div className="flex justify-between w-full h-screen">
            <div className="flex h-full border-r border-[#27272A]">
                {isRenderable && (
                    <Sidebar
                        className="!z-10 !border-0 h-full text-sm"
                        breakPoint="md"
                        width={isMdBreakpoint ? "100%" : "227px"}
                        collapsed={collapse}
                        collapsedWidth="250px"
                        backgroundColor="#0F0F11"
                    >
                        <div className="flex flex-col h-full">
                            <Sidebarheader />
                            <div className="flex flex-1 p-4 md:p-0 justify-center">
                                <Menu
                                    className="mt-12 w-3/4"
                                    menuItemStyles={{
                                        button: {
                                            '&:hover': {
                                                backgroundColor: "#0F0F11",
                                            }
                                        },
                                    }}
                                >
                                    <div className="flex flex-col">
                                        <MenuItem
                                            active={isSelectedMenuItem("Dashboard")}
                                            onClick={() => handleMenuItemClick("Dashboard")}
                                            icon={
                                                <MdOutlineDashboard
                                                    color={getMenuItemSelectedColor("Dashboard")}
                                                    size={24}
                                                />
                                            }
                                            className={`hover:bg-none ${isSelectedMenuItem("Dashboard") ? "border-[1px] border-[#F57C00] rounded-md bg-[rgba(245, 124, 0, 0.10)] text-[#F57C00]" : "text-[#52525B] font-semibold"}`}
                                            style={{
                                                backgroundColor: isSelectedMenuItem("Dashboard") ? "rgb(245, 124, 0, 0.10)" : undefined,
                                                borderRadius: isSelectedMenuItem("Dashboard") ? "0.375rem" : undefined,
                                                height: "40px",
                                            }}
                                        >
                                            Dashboard
                                        </MenuItem>
                                        <div
                                            className={`flex items-center gap-3 mt-3 p-2 pl-6 cursor-pointer ${isSelectedMenuItem("Projects") ? "border-[1px] border-[#F57C00] rounded-md bg-[rgba(245, 124, 0, 0.10)] text-[#F57C00] font-bold" : "text-[#52525B] font-semibold"}`}
                                            style={{
                                                backgroundColor: isSelectedMenuItem("Projects") ? "rgb(245, 124, 0, 0.10)" : undefined,
                                                borderRadius: isSelectedMenuItem("Projects") ? "0.375rem" : undefined,
                                                height: "40px",
                                            }}
                                        >
                                            <GoProjectRoadmap
                                                color={getMenuItemSelectedColor("Projects")}
                                                size={24}
                                            />
                                            <span>Projects</span>
                                        </div>
                                        {projects.map((project, index) => (
                                            <MenuItem
                                                key={index}
                                                active={isSelectedMenuItem("Projects") && project?.tokenDetails?.tokenName === selectedProject?.tokenDetails?.tokenName}
                                                onClick={() => handleMenuItemClick("Projects", project)}
                                                className={`ml-3 relative font-semibold ${isSelectedMenuItem("Projects") && project?.tokenDetails?.tokenName === selectedProject?.tokenDetails?.tokenName ? "text-white" : "text-[#52525B]"}`}
                                            >
                                                <div className="flex gap-[2px] items-center  h-[50px] ">
                                                    <Image src={"/Rectangle.svg"} alt="logo" width={37} height={37} />
                                                    <div className="flex items-end -bottom-2 left-[60px] z-50 absolute">
                                                        <p className="text-sm font-bold ">{project?.tokenDetails?.tokenName}</p>
                                                    </div>
                                                </div>
                                            </MenuItem>
                                        ))}
                                    </div>
                                </Menu>
                            </div>
                        </div>
                    </Sidebar>
                )}
            </div>
            <div className="bg-[#09090B] text-white w-full h-full overflow-auto pt-[90px] scrollbar-hide">
                {children}
            </div>
        </div>
    );
};
