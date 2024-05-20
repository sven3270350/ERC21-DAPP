export const saveProjectData = (key: string, value: any) => {
    const existingData = JSON.parse(localStorage.getItem('projectData') || '{}');
    const updatedData = { ...existingData, [key]: value };
    localStorage.setItem('projectData', JSON.stringify(updatedData));
};

export const getProjectData = () => {
    if (typeof window !== 'undefined') {
        const data = localStorage.getItem('projectData');
        return data ? JSON.parse(data) : {};
    }
    return {};
};