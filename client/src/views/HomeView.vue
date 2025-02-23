<script setup lang="ts">
import NerdAmico from '@/components/icons/NerdAmico.vue';
import Navbar from '@/components/Navbar.vue';
import { RouterLink } from 'vue-router';
</script>

<template>
    <Transition>    
    <div>
        <Navbar/>
        <div class="flex pt-10 justify-center items-center h-screen w-screen">
            <NerdAmico />
            <div class="md:pl-20 flex flex-start flex-col w-1/2 pt-10">
                <h1 class="text-3xl md:text-5xl font-semibold mb-2">Welcome to the </h1>
                <h1 class="text-3xl md:text-5xl font-extrabold text-[#00BD7E]">CCS Sitin Monitoring System</h1>
                <p class="pt-5 text-lg">This is a web application that allows you to monitor the situation in the CCS Sitin.</p>
                <div class="flex">
                    <RouterLink class=" mt-10 px-4 py-2 rounded text-white cursor-pointer text-lg bg-[#00BD7E] hover:bg-[#00BD7E]/65 transition-colors duration-400" to="/register">Get Started</RouterLink>
                </div>
            </div>
        </div>
    </div>
</Transition>

</template>
<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>