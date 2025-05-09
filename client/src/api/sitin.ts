import axios from "axios";

type SitIn = {
    idno: string,
    sitin_purpose: string,
    sitin_laboratory: string
}

export const addSitIn = async (sitin: SitIn) => {
    console.log("sitin",sitin);
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

export const resetAllSessions = async () => {
    const response = await axios.post('http://localhost:3000/sitin/reset');
    return response.data;
}

export const addPoint = async (sitin_id : string) => {
    const response = await axios.post('http://localhost:3000/sitin/point/'+sitin_id);
    return response.data;
}

export const getLeaderboard = async () => {
    const response = await axios.get('http://localhost:3000/sitin/leaderboard');
    return response.data;
}

export const resetStudentSession = async (idno: string) => {
    const response = await axios.post('http://localhost:3000/sitin/reset/'+idno);
    return response.data;
}

export const addSessionFromPoint = async (idno: string) => {
    console.log('idno', idno)
    const response = await axios.post('http://localhost:3000/sitin/point/idno/'+idno);
    return response.data;
}

