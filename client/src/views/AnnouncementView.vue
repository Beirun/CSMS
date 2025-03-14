<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { getAnnouncements } from '@/api/announcement'
import { ref } from 'vue'
import NavbarDashboard from '@/components/NavbarDashboard.vue';
import type { Announcement } from '@/types/announcement'
import { setDate } from '@/library/date'

const announcements = ref<Announcement[]>([])
const loaded = ref(false)
onBeforeMount(async () => {
  const response = await getAnnouncements()
  announcements.value = response.announcements;
  loaded.value = true
})

</script>
<template>
    <NavbarDashboard/>
    <div class="flex flex-col items-center justify-center min-h-screen w-screen text-white pt-20">
      <p class="text-4xl font-bold py-20">ANNOUNCEMENTS</p>
      <div class="min-h-100 w-[85%] pb-15  flex items-center justify-center">
      <div v-if="announcements.length > 0" class="flex flex-col gap-25 py-5">
        <div class="w-full flex " :class="index % 2 === 1 ? 'flex-row-reverse' : ''" v-for="(announcement,index) in announcements" :key="announcement.announcement_id">
          <div :class="index % 2 === 1 ? 'hover:drop-shadow-announcement-card-right hover:-translate-x-7.5' : 'hover:drop-shadow-announcement-card-left hover:translate-x-7.5'" class="shadow-lg shadow-black/50 flex flex-col gap-2 w-2/3 bg-[#2e2e2e] p-5 rounded-md  transition-all duration-300  hover:shadow-md hover:shadow-[#2e2e2e]">
            <p class="text-4xl font-bold">CCS Admin</p>
            <p class="text-2xl font-semibold">{{ setDate(announcement.announcement_date) }}</p>
            <p class="text-xl font-semibold">{{ announcement.announcement_message }}</p>
          </div>
        </div>
      </div>
      <div v-else class="text-4xl font-bold">NO ANNOUNCEMENTS YET</div>
    </div>
    </div>
  </template>