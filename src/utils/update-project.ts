import axios from "axios";

export const UpdateProject = async (projectId: string, data: any, userId: any) => {
    try {
        const res = await axios.put(`/api/project`, { projectId, projectData: data, userId });
        if (res.status !== 200) {
            return { error: res.data };
        }
        return { data: res.data }
    } catch (error) {
        console.log(error);
    }
}