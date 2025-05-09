import axios from "axios";
import type { PC } from "@/types/PC";

//get pc
export const getPCs = async () => {
    const response = await axios.get('http://localhost:3000/pc');
    return response.data;
}

//update pc status by pcno and labno
export const updatePC = async (pc: PC) => {
    const response = await axios.put('http://localhost:3000/pc/update', pc);
    return response.data;
}


//get available pc
export const getAvailablePCs = async () => {
    const response = await axios.get('http://localhost:3000/pc/available');
    return response.data;
}