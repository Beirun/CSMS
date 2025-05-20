import axios from "axios";


export const getNotifications = async (idno : string) => {
    const response = await axios.get('http://localhost:3000/notification/'+idno);
    return response.data;
}

export const updateNotification = async (notif_id : string, status : string = "read") => {
    const response = await axios.put('http://localhost:3000/notification/'+notif_id, {status : status});
    return response.data;
}

export const postNotification = async (idno : string, title : string, message : string,  type : string, status : string = 'unread') => {
    const response = await axios.post('http://localhost:3000/notification', {idno : idno, title : title, message : message, status : status, type : type});
    return response.data;
}
export const deleteNotification = async (notif_id : string) => {
    const response = await axios.delete('http://localhost:3000/notification/'+notif_id);
    return response.data;
}