<script setup lang="ts">
import { RouterLink } from 'vue-router'
import LibraryAmico from './icons/LibraryAmico.vue';
import { onBeforeUnmount } from 'vue';



const navigateToRegister = () => {
    const elements = document.querySelectorAll('.curtain-shrink')
    elements.forEach(element => {
        element.classList.add('curtain-unshrink')
    })
    setTimeout(() => {
        window.location.href = '/register'
    },500)
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
        <div class="w-1/2 h-full border-r border-[#2a2a2a] flex justify-center items-center flex-col">
            <h1 class="text-3xl mb-7 text-[#00BD7E] font-bold">LOGIN</h1>
            <input type="text" class="text-[#8e8e8e] my-3 px-2 w-5/7 h-9 border-b-2 border-[#3e3e3e] focus:outline-none before:z-10 before:p-2.5 before:bg-amber-200 placeholder:text-[#8e8e8e]" placeholder="Username">
            <input type="password" class="text-[#8e8e8e] my-3 px-2 w-5/7 h-9 border-b-2 border-[#3e3e3e] focus:outline-none placeholder:text-[#8e8e8e]" placeholder="Password">
            <button class="w-5/7 mt-10 px-5 py-2 rounded text-[#ffff] font-semibold cursor-pointer text-lg bg-[#00BD7E] hover:bg-[#00BD7E]/65 transition-colors duration-400">LOGIN</button>
            <div class="flex flex-row xl:flex-row lg:flex-col md:flex-col mt-10 sm:flex-col sm:item-center sm:justify-center">
                <p class="text-lg text-[#8e8e8e] mr-1.5">Don't have an account?</p>
                <div class="flex justify-center">
                    <button @click="navigateToRegister" class="w-auto text-[#00BD7E]/75 hover:text-[#00BD7E] font-semibold cursor-pointer text-lg hover:underline transition-colors duration-400">Register Here!</button>
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