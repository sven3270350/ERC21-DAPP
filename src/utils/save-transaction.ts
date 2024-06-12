import axios from "axios";

export const saveTransaction = async (data: {
    userId: number;
    transactionHash: string;
    transactionType: string;
    projectId: string;
}) => {
    try {
        const res = await axios.post("/api/polling/request", data);
        if (res?.data?.error) {
            return {
                success: false,
                error: res?.data?.error
            };
        }
        return {
            success: true,
            data: res?.data?.userRequest
        };

    } catch (error) {
        return {
            success: false,
            error: error
        };
    }
}