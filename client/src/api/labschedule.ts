import axios from "axios";

export const getLabSchedule = async (lab: string) => {
    const response = await axios.get('http://localhost:3000/schedules/'+lab);
    return response.data;
}

export const updateSchedule = async (lab : string, time : string, day : string, status : string) => {
    const response = await axios.put('http://localhost:3000/schedules/update', {lab : lab, time : time, day : day, status : status});
    return response.data;
}


