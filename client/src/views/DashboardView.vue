<script setup lang="ts">
import NavbarDashboard from '@/components/NavbarDashboard.vue';
</script>

<template>
    <div class="w-screen h-screen flex justify-center items-center">
        <NavbarDashboard/>
        <div class="flex flex-col items-center justify-center h-screen w-screen text-white">
        <div class="flex flex-col gap-10 w-1/2">
        <div class="flex flex-col gap-3 bg-[#202020] rounded-lg shadow-md shadow-[#101010] p-10">
          <div class="header"><div class="text-[#00BD7E] text-lg font-semibold">CCS Admin</div> | <div class="text-[#00BD7E]">2025-Feb-03</div></div>
          <div class="announcementContent">
            The College of Computer Studies will open the registration of students for the Sit-in
            privilege starting tomorrow. Thank you! Lab Supervisor
          </div>
        </div>
  
        <div class="flex flex-col gap-3  bg-[#202020] rounded-lg shadow-md shadow-[#101010] p-10">
          <div class="header"><div class="text-[#00BD7E] text-lg font-semibold">CCS Admin</div> | <div class="text-[#00BD7E]">2024-May-08</div></div>
          <div class="announcementContent">
            Important Announcement We are excited to announce the launch of our new website! 🎉
            Explore our latest products and services now!
          </div>
        </div>
      </div>
    </div>
    </div>
</template>