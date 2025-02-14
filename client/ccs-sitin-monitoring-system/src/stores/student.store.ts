import { defineStore } from "pinia";
import { reactive } from "vue";

export const useStudentStore = defineStore("student",() => {

    const student = reactive({
        idNo: '',
        firstName: '',
        middleName: '',
        lastName: '',
        course: '',
        yearLevel: '',
        email: '',
        username: '',
        password: '',
    })

    function setStudent(studentInfo: any) {
        student.idNo = studentInfo.idno;
        student.firstName = studentInfo.firstname;
        student.middleName = studentInfo.middlename;
        student.lastName = studentInfo.lastname;
        student.course = studentInfo.course;
        student.yearLevel = studentInfo.yearlevel;
        student.email = studentInfo.email;
        student.username = studentInfo.username;
        student.password = studentInfo.password;

    }
    return { student, setStudent };
    
});