import axios from "axios";


export const getFiles = async () => {
    const response = await axios.get('http://localhost:3000/resource/files');
    return response.data;
}

export const getDownloadUrl = async (index: number) => {
    const response = await axios.get(`http://localhost:3000/resource/download/${index}`);
    return response.data;
}

export const uploadFileApi = async (file: File) => {
    const formData = new FormData();
    console.log("File ",file);
    formData.append('file', file, file.name);  // 'file' should match the field name expected by multer
    
    console.log("FormData ",formData);
    const response = await axios.post('http://localhost:3000/resource/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
}