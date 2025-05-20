<script setup lang="ts">
import { addAnnouncement, getAnnouncements } from '@/api/announcement'
import Megaphone from '@/components/icons/Megaphone.vue'
import AdminNavbar from '@/components/AdminSidebar.vue'
import { onBeforeMount, ref } from 'vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import {
  Card,
  CardContent,
  // CardDescription, // Can be used if needed
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { errorToast, successToast } from '@/library/toast'
import { setDate } from '@/library/date'
import type { Announcement } from '@/types/Announcement'
const loaded = ref(false)


const closeModal = () => {
  isOpen.value = false
}

const announcement = ref('')
const announcements = ref<Announcement[]>([])
const isOpen = ref(false)
onBeforeMount(async () => {
  const response = await getAnnouncements()
  announcements.value = response.announcements;
  loaded.value = true
})

const handleCreateAnnouncement = async () => {
  if(announcement.value === '') {
    errorToast('Please fill out all the fields')
    return
  }
  const response = await addAnnouncement(announcement.value)
  if (response.success) {
    successToast('Announcement created successfully')
    announcement.value = ''
    const response = await getAnnouncements()
    announcements.value = response.announcements;
    closeModal()
  }
}
const formatTimelineDate = (dateString: string) => {
  const formattedDate = setDate(dateString); // Use your existing formatter
  const parts = formattedDate.split(','); // Assuming format like "Month Day, Year"
  return {
    main: parts[0]?.trim() || formattedDate,
    secondary: parts[1]?.trim() || '',
  };
};
const timelineItemSpacing = '2.5rem'; // Corresponds to space-y-10

</script>
<template>
  <div class="min-h-screen max-w-screen flex flex-col items-center">
    <div class="w-[85%] pt-25">
      <button
        @click="isOpen = true"
        class="w-full px-5 py-10 rounded-lg text-[#00BD7E] font-semibold cursor-pointer text-xl border-2 border-[#00BD7E] flex items-center justify-center hover:bg-[#00BD7E]/10 hover:text-[#fafafa] transition-colors duration-400"
      >
        <i class="pi pi-megaphone text-2xl -rotate-30"></i>

        &nbsp;&nbsp;CREATE ANNOUNCEMENT
      </button>
      <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="closeModal" class="relative z-10">
          <TransitionChild
            as="template"
            enter="duration-200 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black/50" />
          </TransitionChild>

          <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
              >
                <DialogPanel
                  class="text-lg flex justify-center items-center w-200 h-150 bg-[#2e2e2e] transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all"
                >
                <div class="flex flex-col gap-5 justify-between items-center h-full py-5 pt-10">
                    <DialogTitle as="h3" class="text-5xl font-bold leading-6 text-[#00BD7E]">ANNOUNCEMENT</DialogTitle>
                    <textarea v-model="announcement" class="bg-[#3a3a3a] focus:outline-none rounded-md p-5 resize-none bg-" cols="75" rows="9" placeholder="What do you want to announce?"></textarea>
                    <button
                    @click="handleCreateAnnouncement"
                    class="focus:outline-none w-full h-15 px-5 py-2 rounded text-[#ffff] font-semibold cursor-pointer text-lg bg-[#00BD7E] hover:bg-[#00BD7E]/65 transition-colors duration-400"
                  >
                    CREATE ANNOUNCEMENT
                  </button>
                </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </div>
    <div class="w-[85%] h-[5px] bg-[#4d4d4d] my-10"></div>
          
    <div v-if="!loaded" :class="`space-y-10`"> 
      <div v-for="i in 3" :key="`skeleton-timeline-${i}`" class="flex items-start">
        <!-- Skeleton Date -->
        <div class="w-20 sm:w-24 text-right pr-3 sm:pr-4 flex-shrink-0 pt-0.5">
          <Skeleton class="h-4 w-3/4 mb-1 ml-auto" />
          <Skeleton class="h-3 w-1/2 ml-auto" />
        </div>
        <!-- Skeleton Dot & Line -->
        <div class="relative mx-1 sm:mx-2 flex-shrink-0">
          <Skeleton class="h-4 w-4 sm:h-5 sm:w-5 rounded-full mt-[1px]" />
          <!-- Adjust height based on typical card height + spacing -->
          <Skeleton :class="`absolute top-5 sm:top-6 left-1/2 w-0.5 h-[calc(100% + ${timelineItemSpacing})] -translate-x-1/2`" />
        </div>
        <!-- Skeleton Card -->
        <div class="flex-1 min-w-0 pl-3 sm:pl-4">
          <Card>
            <CardHeader class="py-3 sm:py-4 px-4 sm:px-5">
              <Skeleton class="h-5 w-3/5" />
            </CardHeader>
            <CardContent class="py-3 sm:py-4 px-4 sm:px-5 space-y-2">
              <Skeleton class="h-4 w-full" />
              <Skeleton class="h-4 w-5/6" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <!-- Actual Timeline -->
    <div v-else class="pb-8 flex w-8/10">
      
      <div v-if="announcements.length > 0" :class="`space-y-10 grid w-full`">
        <div
          v-for="(announcement, index) in announcements"
          :key="announcement.announcement_id"
          class="flex items-center -ml-5"
        >
        <!-- Content Card (Right of timeline) -->
          <div class="flex-1 min-w-0 pl-3 sm:pl-4 ">
            <Card v-if="index%2==0" class="hover:shadow-xl -ml-10 hover:bg-[#212121]  hover:shadow-[#00BD7E] transition-shadow border-0 duration-300 ease-in-out group w-150 bg-gradient-to-l from-[#212121] via-[#212121] via-[85%] to-transparent">
              <CardHeader class="py-3 sm:py-4 px-4 sm:px-5">
                <CardTitle class="text-3xl leading-1 text-foreground group-hover:text-primary transition-colors">
                  <!-- Using a generic title, or use announcement.title if available -->
                  Announcement <!-- Was "CCS Admin", now more generic. Can be dynamic. -->
                </CardTitle>
                <!-- Optional: If you want to show "CCS Admin" subtly -->
                <!-- <CardDescription class="text-xs pt-1">By CCS Admin</CardDescription> -->
              </CardHeader>
              <CardContent class="py-3 sm:py-4 px-4 sm:px-5">
                <p class="text-base text-foreground/90 leading-relaxed">
                  {{ announcement.announcement_message }}
                </p>
              </CardContent>
            </Card>
          </div>
          <!-- Date Column (Left of timeline) -->
          <div class="w-20 sm:w-24 text-right pr-3 sm:pr-4 flex-shrink-0 pt-0.5">
            <div v-if="index%2==1">
              <p class="text-sm font-medium text-muted-foreground">
                {{ formatTimelineDate(announcement.announcement_date).main }}
              </p>
              <p class="text-xs text-muted-foreground/80">
                {{ formatTimelineDate(announcement.announcement_date).secondary }}
              </p>
            </div>
          </div>

          <!-- Timeline Dot & Connector Line -->
          <div class="relative mx-1 sm:mx-2 flex-shrink-0">
            <!-- Dot -->
            <div class="h-4 w-4 sm:h-5 sm:w-5 bg-[#2a2a2a] rounded-full border-2 border-[#00BD7E] flex items-center justify-center shadow-md mt-[1px]">
              <!-- You could put an icon here if desired, e.g., BellIcon -->
            </div>
            <div v-if="index < announcements.length-1"
              :class="`absolute left-2.25 w-0.5 h-[calc(1350%)] bg-[#00BD7E]`"
              aria-hidden="true"
            ></div>
          </div>
<!-- Date Column (Left of timeline) -->
          <div class="w-20 sm:w-24 text-right pr-3 sm:pr-4 flex-shrink-0 pt-0.5">
            <div v-if="index%2==0">

              <p class="text-sm font-medium text-muted-foreground">
                {{ formatTimelineDate(announcement.announcement_date).main }}
              </p>
              <p class="text-xs text-muted-foreground/80">
                {{ formatTimelineDate(announcement.announcement_date).secondary }}
              </p>
            </div>
          </div>
          <!-- Content Card (Right of timeline) -->
          <div class="flex-1 min-w-0 pl-3 sm:pl-4 ">
            <Card :class="`${index%2==1? '-ml-20':''}`" v-if="index%2==1" class="hover:bg-[#212121]  hover:shadow-[#00BD7E] hover:shadow-xl transition-shadow border-0 duration-300 ease-in-out group w-150 bg-gradient-to-r from-[#212121] via-[#212121] via-[85%] to-transparent">
              <CardHeader class="py-3 sm:py-4 px-4 sm:px-5">
                <CardTitle class="text-3xl leading-1 text-foreground group-hover:text-primary transition-colors">
                  <!-- Using a generic title, or use announcement.title if available -->
                  Announcement <!-- Was "CCS Admin", now more generic. Can be dynamic. -->
                </CardTitle>
                <!-- Optional: If you want to show "CCS Admin" subtly -->
                <!-- <CardDescription class="text-xs pt-1">By CCS Admin</CardDescription> -->
              </CardHeader>
              <CardContent class="py-3 sm:py-4 px-4 sm:px-5">
                <p class="text-base text-foreground/90 leading-relaxed">
                  {{ announcement.announcement_message }}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-12">
        <h2 class="text-2xl font-semibold text-muted-foreground">
          No Announcements Yet
        </h2>
        <p class="text-muted-foreground mt-2">
          Check back later for new updates!
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>

.pokemon {
  position: relative;
  height: 100px;
  width: 100px;
  background: linear-gradient(to bottom, rgb(254, 0, 1) 50%, white 50% );
  border-radius: 50%;
  border: 8px solid black;
  animation: spin 1s linear infinite;
}

.pokemon::before {
  content: '';
  position: absolute;
  height: 8px;
  width: 100px;
  background: black;
  top: 50px;
  transform: translatey(-50%);
}

.pokemon::after {
  content: '';
  position: absolute;
  height: 38px;
  width: 38px;
  border-radius: 50%;
  background: white;
  top: 50px;
  left: 50px;
  transform: translate(-50%, -50%);
  box-shadow: inset 0 0 0 8px black, inset 0 0 0 10px white, inset 0 0 0 12px black;

}

/* Spin Animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}


</style>
