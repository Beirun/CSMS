import axios from "axios";

type SitIn = {
    idno: string,
    sitin_purpose: string,
    sitin_laboratory: string
}

export const addSitIn = async (sitin: SitIn) => {
    console.log(sitin);
    const response = await axios.post('http://localhost:3000/sitin', sitin);
    return response.data;
}

export const getCurrentSitin = async () => {
    const response = await axios.get('http://localhost:3000/sitin/current');
    return response.data;
}

export const logoutSitin = async (sitin_id : string) => {
    const response = await axios.post('http://localhost:3000/sitin/logout/'+sitin_id)
    return response.data;
}

export const getSitins = async () => {
    const response = await axios.get('http://localhost:3000/sitin');
    return response.data;
}

export const getSitinsByStudent = async (idno: string) => {
    const response = await axios.get('http://localhost:3000/sitin/student/'+idno);
    return response.data;
}

