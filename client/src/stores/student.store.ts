import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import type { Notification } from "@/types/Notification";
import { getNotifications } from "@/api/notification";
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

export const useNotificationStore = defineStore("notification", () => {
    const notifications = ref<Notification[]>([]);
    const fetchNotifications = async (id:string) => {
        try {
            const response = await getNotifications(id);
            console.log(response)
            notifications.value = response.notifications;
            console.log("Notifications fetched:", response.notifications);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
        
    }

    return { notifications, fetchNotifications };
},{persist: true});