<script setup lang="ts">
import { useRouter } from 'vue-router'
import LibraryAmico from './icons/LibraryAmico.vue';
import { onBeforeUnmount, reactive } from 'vue';
import { checkStudentIdno, addStudent } from '@/api/student';
import { errorToast, successToast } from '@/library/toast';
import Input from './ui/TextField.vue';
import { closeForm } from '../library/form';

const state = reactive({
    idno: '',
    firstname: '',
    lastname: '',
    middlename: '',
    username: '',
    yearlevel: '',
    course: '',
    email: '',
    password: '',
    confirmPassword: ''
})

const router = useRouter()

const navigateToLogin = () => {
    closeForm
    setTimeout(() => {
        router.push('/login')
    },500)
}

const courses = [
    'BSCS', 'BSIT', 'BSIS', 'BSHM', 'BSCJ', 'BSBA', 'BSCPE', 'BSED'
]

const yearLevels = [
    '1st Year', '2nd Year', '3rd Year', '4th Year'
]

const handleRegister = async() => {

    if(!state.idno || !state.firstname || !state.lastname || !state.username || !state.yearlevel || !state.course || !state.email || !state.password || !state.confirmPassword) {
        errorToast('Please fill out all the fields')
        return
    }
    
    const {success} = await checkStudentIdno(state.idno);
    if (!success) {
        errorToast('Student ID already exist')
    }
    if (state.password !== state.confirmPassword) {
        errorToast('Passwords do not match')
    }

    const newStudent = {
        idno: state.idno,
        firstname: state.firstname,
        middlename: state.middlename,
        lastname: state.lastname,
        course: state.course,
        yearlevel: state.yearlevel,
        email: state.email,
        username: state.username,
        password: state.password
    }

    const response = await addStudent(newStudent)

    if (response.success) {
        successToast('Registration successful')
        navigateToLogin()
    }

}


</script>
<template>
    <div class="w-3/5 outline-4 outline-[#181818] h-5/6 absolute flex flex-row pointer-events-none z-10">
        <div class="w-1/2 h-full flex justify-start">
            <div class="curtain-shrink w-full h-full bg-[#181818]"></div>
        </div>
        <div class="w-1/2 h-full flex justify-end">
            <div class="curtain-shrink w-full h-full bg-[#181818]"></div>
        </div>
    </div>
    <div class="w-3/5 h-4/5 bg-[#202020] rounded-lg shadow-md shadow-[#101010] flex flex-row">
        
        <div class="w-1/2 h-full border-r border-[#2a2a2a] flex items-center justify-center flex-col">
            <div class="flex flex-col">
                <p class="text-3xl leading-[.5] mb-5 text-[#fff] font-bold text-center">Welcome to the</p>
                <p class="text-3xl leading-[.5] mb-5 text-[#00BD7E] font-bold text-center">Sit-In Monitoring System!</p>
            </div>
            <LibraryAmico />
        </div>
        <div class="w-1/2 h-full border-l border-[#2a2a2a] flex justify-center items-center flex-col">
            <h1 class="text-3xl mb-7 text-[#00BD7E] font-bold">REGISTER</h1>
            <div class="flex justify-between w-5/7">
                <Input placeholder="First Name" v-model="state.firstname" type="text" class="w-[30%] my-3"/>
                <Input placeholder="Middle Name" v-model="state.middlename" type="text" class="w-[32.5%] my-3"/>
                <Input placeholder="Last Name" v-model="state.lastname" type="text" class="w-[27.5%] my-3"/>

            </div>
            <Input placeholder="Email Address" v-model="state.email" type="text" class="w-5/7 my-3"/>

            <div class="flex justify-between w-5/7">
                <Input placeholder="IDNO" v-model="state.idno" type="text" class="w-[25%] my-3"/>
                <div class="w-[25.7%] h-10 relative mt-[1px]">
                    <select v-model="state.course" name="course" class="h-full my-[calc(var(--spacing)*2.28)] px-2 w-full  outline-none placeholder:text-[#8e8e8e]">
                        <option v-for="course in courses" :key="course" :value="course" class="text-[#f8f8f8] bg-[#181818] outline-none">{{ course }}</option>
                    </select>
                    <div class="absolute top-0 w-full h-full pb-7.75 pt-4.75 border-b-2 border-[#3e3e3e] px-2 text-[#8e8e8e] pointer-events-none">{{ state.course ? "" : "Course" }}</div>
                </div>
                
                <div class="w-[32.5%] h-10 relative mt-[1px] ">

                    <select v-model="state.yearlevel" name="year level" class="h-full my-[calc(var(--spacing)*2.28)] px-2 w-full outline-none placeholder:text-[#8e8e8e]">
                        <option v-for="yearLevel in yearLevels" :key="yearLevel" :value="yearLevel" class="text-[#f8f8f8] bg-[#181818] outline-none">{{ yearLevel }}</option>
                    </select>
                    <div class="absolute top-0 w-full h-full pb-7.75 pt-4.75 border-b-2 border-[#3e3e3e] px-2 text-[#8e8e8e] pointer-events-none">{{ state.yearlevel ? "" : "Year Level" }}</div>
                </div>
            </div>
            <Input placeholder="Username" v-model="state.username" type="text" class="w-5/7 my-3"/>

            <div class="flex justify-between w-5/7">
                <Input placeholder="Password" v-model="state.password" type="password" class="w-[45%] my-3"/>
                <Input placeholder="Confirm Password" v-model="state.confirmPassword" type="password" class="w-[45%] my-3"/>

            </div>
            <button @click="handleRegister" class="w-5/7 mt-10 px-5 py-2 rounded text-[#ffff] font-semibold cursor-pointer text-lg bg-[#00BD7E] hover:bg-[#00BD7E]/65 transition-colors duration-400">REGISTER</button>
            <div class="flex flex-row xl:flex-row lg:flex-col md:flex-col mt-10 sm:flex-col sm:item-center sm:justify-center">
                <p class="text-lg text-[#8e8e8e] mr-1.5">Already have an account?</p>
                <div class="flex justify-center">
                    <button @click="navigateToLogin" class="w-auto text-[#00BD7E]/75 hover:text-[#00BD7E] font-semibold cursor-pointer text-lg hover:underline transition-colors duration-400">Login Here!</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.curtain-shrink{
    animation: shrink .5s ease-out forwards;
}

.curtain-unshrink{
    animation: unshrink .5s ease-in forwards;
}

@keyframes shrink {
    0%{
        width: 100%;
    }
    100%{
        width: 0%;
    }
}

@keyframes unshrink {
    0%{
        width: 0%;
    }
    100%{
        width: 100%;
    }
}

</style>

