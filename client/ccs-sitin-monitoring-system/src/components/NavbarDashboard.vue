<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useStudentStore } from '@/stores/student.store';

const studentStore = useStudentStore();

console.log(studentStore.student)
</script>

<template>
    <div class="flex absolute justify-between w-screen items-center px-2 top-0 bg-[#202020]">
       <div>
        <img src="@/assets/logo.png" alt="Logo" class="h-20 w-20"></div>
       <div class="flex gap-4 text-lg font-semibold">
        <RouterLink to="/profile">
            Profile
        </RouterLink>
       </div>
    </div>
</template>