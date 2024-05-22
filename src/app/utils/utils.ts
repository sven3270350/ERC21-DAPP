type ProjectData = {
    id: string;
    data: any;
};

export const saveProjectData = (projectId: string, projectData: any): void => {
    const existingData = localStorage.getItem('projectData');
    const parsedData: Record<string, any> = existingData ? JSON.parse(existingData) : {};

    parsedData[projectId] = projectData;

    localStorage.setItem('projectData', JSON.stringify(parsedData));
};

export const getProjectData = (projectId: string): any => {
    const data = localStorage.getItem('projectData');
    const parsedData: Record<string, any> = data ? JSON.parse(data) : {};
    return parsedData[projectId] || null;
};

export const generateUniqueId = (): string => {
    return 'project-' + Date.now().toString();
};
