<script setup lang="ts">
import EditProfileForm from '@/components/EditProfileForm.vue'
import NavbarDashboard from '@/components/NavbarDashboard.vue'
</script>

<template>
  <div class="w-screen h-screen flex flex-col justify-center items-center">
    <div class="cursor-pointer absolute top-10 left-10 font-bold text-[#00BD7E]">
      <svg
        @click="$router.push('/dashboard')"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="3"
        stroke="currentColor"
        class="size-8"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
        />
      </svg>
    </div>
    <NavbarDashboard />
    <EditProfileForm />
  </div>
</template>
