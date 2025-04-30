<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useStudentStore } from '@/stores/student.store'
const studentStore = useStudentStore()

console.log(studentStore.student)
</script>

<template>
  <div class="flex absolute justify-between w-screen items-center px-10 top-0 bg-[#202020]">
    <div>
      <img
        @click="$router.push('/dashboard')"
        src="@/assets/logo.svg"
        alt="Logo"
        class="cursor-pointer size-20 drop-shadow-logo"
      />
    </div>
    <div class="flex gap-5 text-lg font-semibold items-center">
      <RouterLink to="/announcement">Announcement</RouterLink>
      <RouterLink to="/lab-rules">Lab Rules and Regulation</RouterLink>
      <RouterLink to="/history">Sitin History</RouterLink>
      <RouterLink to="/student/resources">Lab Resources</RouterLink>
      <RouterLink to="/reservation">Reservation</RouterLink>
      <RouterLink to="/profile">Profile</RouterLink>
      <RouterLink class="w-25 py-1 px-2 cursor-pointer bg-[#00BD7E] hover:bg-[#00BD7E]/65 text-white rounded flex item-center justify-center transition-colors duration-400" to="/login">Logout</RouterLink>
    </div>
  </div>
</template>
