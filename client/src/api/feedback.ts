import axios from "axios";
import type { SitinFeedback } from "@/types/feedback";

export const getSitinFeedbacks = async () => {
    const response = await axios.get('http://localhost:3000/sitin/feedback');
    return response.data;
}

export const submitFeedback = async (feedback: SitinFeedback) => {
    const response = await axios.post('http://localhost:3000/sitin/feedback', feedback);
    return response.data;
}


