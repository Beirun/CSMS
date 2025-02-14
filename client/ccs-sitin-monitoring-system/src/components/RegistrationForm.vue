<script setup lang="ts">
import { RouterLink } from 'vue-router'
import LibraryAmico from './icons/LibraryAmico.vue';
import { onBeforeUnmount, reactive } from 'vue';
import { checkStudentIdno, addStudent } from '@/api/student';


const state = reactive({
    idNo: '',
    firstName: '',
    lastName: '',
    middleName: '',
    username: '',
    yearLevel: '',
    course: '',
    email: '',
    password: '',
    confirmPassword: ''
})



const navigateToLogin = () => {
    const elements = document.querySelectorAll('.curtain-shrink')
    elements.forEach(element => {
        element.classList.add('curtain-unshrink')
    })
    setTimeout(() => {
        window.location.href = '/login'
    },500)
}

const courses = [
    'BSCS', 'BSIT', 'BSIS', 'BSHM', 'BSCJ', 'BSBA', 'BSCPE', 'BSED'
]

const yearLevels = [
    '1st Year', '2nd Year', '3rd Year', '4th Year'
]

const handleRegister = async() => {
    if(!state.idNo || !state.firstName || !state.lastName  || !state.username || !state.yearLevel || !state.course || !state.email || !state.password || !state.confirmPassword) {
        alert('Please fill in all fields')
    }
    const {success} = await checkStudentIdno(state.idNo);
    if (!success) {
        alert('Student ID already exist')
    }
    if (state.password !== state.confirmPassword) {
        alert('Passwords do not match')
    }

    const newStudent = {
        idNo: state.idNo,
        firstName: state.firstName,
        middleName: state.middleName,
        lastName: state.lastName,
        course: state.course,
        yearLevel: state.yearLevel,
        email: state.email,
        username: state.username,
        password: state.password
    }

    const response = await addStudent(newStudent)

    if (response.success) {
        navigateToLogin()
    }

    console.log(state.idNo, state.firstName, state.lastName, state.middleName, state.username, state.yearLevel, state.course, state.email, state.password, state.confirmPassword)
}


</script>
<template>
    <div class="w-3/5 outline-4 outline-[#181818] h-5/6 absolute flex flex-row pointer-events-none ">
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
                <input v-model="state.firstName" type="text" class="text-[#8e8e8e] my-3 px-2 w-[30%] h-9 border-b-2 border-[#3e3e3e] focus:outline-none placeholder:text-[#8e8e8e]" placeholder="First Name">
                <input v-model="state.middleName" type="text" class="text-[#8e8e8e] my-3 px-2 w-[32.5%] h-9 border-b-2 border-[#3e3e3e] focus:outline-none placeholder:text-[#8e8e8e]" placeholder="Middle Name">
                <input v-model="state.lastName" type="text" class="text-[#8e8e8e] my-3 px-2 w-[27.5%] h-9 border-b-2 border-[#3e3e3e] focus:outline-none placeholder:text-[#8e8e8e]" placeholder="Last Name">
            </div>
            <input v-model="state.email" type="text" class="text-[#8e8e8e] my-3 px-2 w-5/7 h-9 border-b-2 border-[#3e3e3e] focus:outline-none placeholder:text-[#8e8e8e]" placeholder="Email Address">
            <div class="flex justify-between w-5/7">
                <input v-model="state.idNo" type="text" class="text-[#8e8e8e] my-3 px-2 w-[25%] h-9 border-b-2 border-[#3e3e3e] focus:outline-none placeholder:text-[#8e8e8e]" placeholder="IDNO">
                <select v-model="state.course" name="course" class="h-9 my-3 px-2 w-[25.7%] border-b-2 border-[#3e3e3e] outline-none placeholder:text-[#8e8e8e]">
                    <option disabled selected value="Course" class="display-none text-[#8e8e8e] bg-[#181818] outline-none disabled:bg-[#181818]">Course</option>
                    <option v-for="course in courses" :key="course" :value="course" class="text-[#8e8e8e] bg-[#181818] outline-none">{{ course }}</option>
                </select>
                
                <select v-model="state.yearLevel" name="year level" class="h-9 my-3 px-2 w-[32.5%] border-b-2 border-[#3e3e3e] outline-none placeholder:text-[#8e8e8e]">
                    <option disabled selected value="Year Level" class="text-[#8e8e8e] bg-[#181818] outline-none">Year Level</option>
                    <option v-for="yearLevel in yearLevels" :key="yearLevel" :value="yearLevel" class="text-[#8e8e8e] bg-[#181818] outline-none">{{ yearLevel }}</option>
                </select>
            </div>
            <input v-model="state.username" type="text" class="text-[#8e8e8e] my-3 px-2 w-5/7 h-9 border-b-2 border-[#3e3e3e] focus:outline-none placeholder:text-[#8e8e8e]" placeholder="Username">
            <div class="flex justify-between w-5/7">

                <input v-model="state.password" type="password" class="text-[#8e8e8e] my-3 px-2 w-[45%] h-9 border-b-2 border-[#3e3e3e] focus:outline-none placeholder:text-[#8e8e8e]" placeholder="Password">
                <input v-model="state.confirmPassword" type="password" class="text-[#8e8e8e] my-3 px-2 w-[45%] h-9 border-b-2 border-[#3e3e3e] focus:outline-none placeholder:text-[#8e8e8e]" placeholder="Confirm Password">
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

