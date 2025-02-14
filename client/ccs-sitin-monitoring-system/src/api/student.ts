import axios from 'axios';


interface Student {
    idNo: string;
    firstName: string;
    middleName: string;
    lastName: string;
    course: string;
    yearLevel: string;
    email: string;
    username: string;
    password: string;
}


export const checkStudentIdno = async (idno: string) => {
    const response = await axios.get(`http://localhost:3000/student/idno/${idno}`);
    return response.data;
}

export const addStudent = async (student: Student) => {
    const response = await axios.post('http://localhost:3000/student', student);
    return response.data;
}

export const getStudent = async (student:{username: String, password: String}) => {
    const response = await axios.post('http://localhost:3000/student/login',student);
    return response.data;
}