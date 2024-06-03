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
console.log("selectedProject", selectedProject);
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
                setSelectedProject(project?.id === selectedProject?.id ? project : null);
                onSelectProject(project?.id === selectedProject?.id ? project : null);
                break;
            default:
                routePath = "/";
                break;
        }
        setActiveMenu(selectedPage);

        if (routePath !== "/") {
            const routeWithQuery = project ? `${routePath}/${encodeURIComponent(project.id)}` : routePath;
            router.push(routeWithQuery);
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
        return isSelectedMenuItem(type) ? "#F57C00" : "#FFFFFF";
    };

    return (
        <div className="flex justify-between w-full h-screen">
            <div className="flex h-full">
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
                                            height: "40px",
                                            '&:hover': {
                                                backgroundColor: "#0F0F11",
                                            }
                                        },
                                    }}
                                >
                                    <div className="flex flex-col space-y-2">
                                        <MenuItem
                                            active={isSelectedMenuItem("Dashboard")}
                                            onClick={() => handleMenuItemClick("Dashboard")}
                                            icon={
                                                <MdOutlineDashboard
                                                    color={getMenuItemSelectedColor("Dashboard")}
                                                    size={24}
                                                />
                                            }
                                            className={isSelectedMenuItem("Dashboard") ? "border-[1px] border-[#F57C00] rounded-md bg-[rgba(245, 124, 0, 0.10)] text-[#F57C00]" : ""}
                                            style={{
                                                backgroundColor: isSelectedMenuItem("Dashboard") ? "rgb(245, 124, 0, 0.10)" : undefined,
                                                borderRadius: isSelectedMenuItem("Dashboard") ? "0.375rem" : undefined,
                                                height: "40px",
                                            }}
                                        >
                                            Dashboard
                                        </MenuItem>
                                        <div
                                            className={`flex items-center gap-3 p-2 pl-7 cursor-pointer ${isSelectedMenuItem("Projects") ? "border-[1px] border-[#F57C00] rounded-md bg-[rgba(245, 124, 0, 0.10)] text-[#F57C00] font-bold" : "text-white"}`}
                                            onClick={() => handleMenuItemClick("Projects")}
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
                                                active={isSelectedMenuItem("Projects") && project.projectName === selectedProject?.projectName}
                                                onClick={() => handleMenuItemClick("Projects", project)}
                                                className={`ml-3 ${isSelectedMenuItem("Projects") && project.projectName === selectedProject?.projectName ? "text-[#F57C00]" : "text-white"}`}
                                                style={{ height: "40px" }}
                                            >
                                                <div className="flex items-end gap-1">
                                                    <Image src={"/Rectangle.svg"} alt="logo" width={35} height={30} />
                                                    <span>{project.projectName}</span>
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
            <div className="bg-[#09090B] text-white w-full h-full overflow-auto pt-24 scrollbar-hide">
                {children}
            </div>
        </div>
    );
};
