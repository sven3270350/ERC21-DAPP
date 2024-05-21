// utils.ts
type ProjectData = {
    [key: string]: any;
};

export const saveProjectData = (key: string, value: any): void => {
    const existingData = localStorage.getItem('projectData');
    const parsedData = existingData ? JSON.parse(existingData) : {};

    parsedData[key] = value;

    localStorage.setItem('projectData', JSON.stringify(parsedData));
};


export const getProjectData = (): ProjectData => {
    if (typeof window !== 'undefined') {
        const data = localStorage.getItem('projectData');
        return data ? JSON.parse(data) : {};
    }
    return {};
};
