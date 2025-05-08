<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import LibraryAmico from './icons/LibraryAmico.vue';
import { reactive } from 'vue';
import { getStudent } from '@/api/student';
import { useStudentStore } from '@/stores/student.store';
import { errorToast, successToast } from '@/library/toast';
import { closeForm } from '@/library/form';
import Input from './ui/TextField.vue';
 
const studentStore = useStudentStore();



const state = reactive({
    username: '',
    password: ''
})

const router = useRouter()

const navigateToPage = (page : string) => {
    closeForm()
    setTimeout(() => {
        router.push(page)
    },500)
}

const navigateToDashboard = async () => {
    if(state.username === '' || state.password === '') {
        errorToast('Please fill in all fields');
        return;
    }

    if(state.username === 'admin' && state.password === 'admin') {
        successToast('Login successful');
        navigateToPage('/dashboard/admin');
        
        setTimeout(() => {
            studentStore.setUser("admin")
    },500)
        console.log(studentStore.user.type)
        return;
    }
    console.log(state.username, state.password)
    const student = {username: state.username, password: state.password};
    const {success, studentInfo} = await getStudent(student);

    if (!success) {
        errorToast('Invalid username or password');
        return;
    }
    successToast('Login successful');
    
    navigateToPage('/dashboard');
    studentStore.setStudent(studentInfo);
    setTimeout(() => {
        studentStore.setUser("student")
    },500)
    console.log(studentStore.user.type)
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
        <div class="w-1/2 h-full border-r border-[#2a2a2a] flex justify-center items-center flex-col">
            <h1 class="text-3xl mb-7 text-[#00BD7E] font-bold">LOGIN</h1>
            <Input  placeholder="Username" v-model="state.username" type="text" class="w-5/7 my-3"/>
            <Input  placeholder="Password" v-model="state.password" type="password" class="w-5/7 my-3"/>
            <button @click="navigateToDashboard" class="w-5/7 mt-10 px-5 py-2 rounded text-[#ffff] font-semibold cursor-pointer text-lg bg-[#00BD7E] hover:bg-[#00BD7E]/65 transition-colors duration-400">LOGIN</button>
            <div class="flex flex-row xl:flex-row lg:flex-col md:flex-col mt-10 sm:flex-col sm:item-center sm:justify-center">
                <p class="text-lg text-[#8e8e8e] mr-1.5">Don't have an account?</p>
                <div class="flex justify-center">
                    <button @click="navigateToPage('/register')" class="w-auto text-[#00BD7E]/75 hover:text-[#00BD7E] font-semibold cursor-pointer text-lg hover:underline transition-colors duration-400">Register Here!</button>
                </div>
            </div>
        </div>
        <div class="w-1/2 h-full border-l border-[#2a2a2a] flex items-center justify-center flex-col">
            <div class="flex flex-col">
                <p class="text-3xl leading-[.5] mb-5 text-[#fff] font-bold text-center">Welcome to the</p>
                <p class="text-3xl leading-[.5] mb-5 text-[#00BD7E] font-bold text-center">Sit-In Monitoring System!</p>
            </div>
            <LibraryAmico />
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