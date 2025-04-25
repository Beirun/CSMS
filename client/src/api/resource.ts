import axios from "axios";

export const getFiles = async () => {
    const response = await axios.get('http://localhost:3000/resource/files');
    return response.data;
}

export const getDownloadUrl = async (index: number) => {
    const response = await axios.get(`http://localhost:3000/resource/download/${index}`);
    return response.data;
}