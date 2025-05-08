<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { getAnnouncements } from '@/api/announcement'
import { ref } from 'vue'
import AdminNavbar from '@/components/AdminSidebar.vue';
import type { Announcement } from '@/types/Announcement'
import { setDate } from '@/library/date'


</script>

<template>
    <div class="flex flex-col items-center justify-center h-screen max-w-screen text-white pt-10 gap-10 px-10">
      <div class="flex items-center justify-center w-full h-1/2 gap-10">
        <div class="flex w-3/4 h-full bg-red-500">

        </div>
        <div class="flex w-1/4 h-full bg-[#2e2e2e] rounded-md justify-center p-4">
            <p class="text-2xl font-bold">LEADERBOARDS</p>
        </div>
      </div>
      <div class="flex items-center justify-center w-full h-1/2 gap-10">
        <div class="flex w-2/3 h-full bg-blue-500">

        </div>
        <div class="flex w-1/3 h-full bg-green-500">

        </div>
      </div>
      <div>

      </div>
    </div>
</template>
