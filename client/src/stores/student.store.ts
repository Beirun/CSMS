import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useStudentStore = defineStore("student",() => {
    const user = reactive({
        type: 'none',
    })
    const student = reactive({
        idno: '',
        firstname: '',
        middlename: '',
        lastname: '',
        course: '',
        yearlevel: '',
        email: '',
        username: '',
        password: '',
        sessions: '',
        poke_icon: '',
    })
    function setUser(type: string) {
        console.log("type", type);
        user.type = type;
    }
    function setStudent(studentInfo: any) {
        student.idno = studentInfo.idno;
        student.firstname = studentInfo.firstname;
        student.middlename = studentInfo.middlename;
        student.lastname = studentInfo.lastname;
        student.course = studentInfo.course;
        student.yearlevel = studentInfo.yearlevel;
        student.email = studentInfo.email;
        student.username = studentInfo.username;
        student.password = studentInfo.password;
        student.sessions = studentInfo.sessions;
        student.poke_icon = studentInfo.poke_icon;

    }
    return { student, setStudent, user, setUser };
    
},{persist: true});