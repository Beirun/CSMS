import axios from 'axios';


type Student = {
    idno: string;
    firstname: string;
    middlename: string;
    lastname: string;
    course: string;
    yearlevel: string;
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

export const updateStudent = async (student: Student) => {
    const response = await axios.put('http://localhost:3000/student', student);
    return response.data;
}

export const getStudents = async () => {
    const response = await axios.get('http://localhost:3000/student')
    return response.data
}