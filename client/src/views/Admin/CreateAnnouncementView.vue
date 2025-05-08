<script setup lang="ts">
import { addAnnouncement, getAnnouncements } from '@/api/announcement'
import Megaphone from '@/components/icons/Megaphone.vue'
import AdminNavbar from '@/components/AdminSidebar.vue'
import { onBeforeMount, ref } from 'vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
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
    <!-- <div class="min-h-100 flex items-center justify-center">
          
    </div> -->
    <div class="min-h-100 w-[85%] pb-15 flex items-center justify-center">
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
