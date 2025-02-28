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