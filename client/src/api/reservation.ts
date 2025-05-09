import axios from "axios";

//reservations
export const getReservations = async () => {
    const response = await axios.get('http://localhost:3000/reservation');
    return response.data;
}

//get reservation by idno
export const getReservationsByStudent = async (idno: string) => {
    const response = await axios.get('http://localhost:3000/reservation/student/'+idno);
    return response.data;
}

//add reservation
export const addReservation = async (reservation: any) => {
    const response = await axios.post('http://localhost:3000/reservation', reservation);
    return response.data;
}

//update reservation status
export const updateReservation = async (id: string, status: string) => {
    const response = await axios.put('http://localhost:3000/reservation/update', {id : id, status : status});
    return response.data;
}
