<script setup lang="ts">
import SitinCard from '@/components/SitinCard.vue'
import { getCurrentSitin, logoutSitin, addPoint, addSessionFromPoint } from '@/api/sitin'
import AdminNavbar from '@/components/AdminSidebar.vue'
import { toBase64 } from '@/library/base64'
import type { CurrentSitin } from '@/types/Sitin'
import { computed, onBeforeMount, ref } from 'vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { getCurrentDate, setDate } from '@/library/date'
import { errorToast, successToast } from '@/library/toast'
import { postNotification } from '@/api/notification'

const search = ref("")
const pointChecked = ref(false)
const currentStudentSitin = ref<CurrentSitin>({
  sitin_id: '',
  idno: '',
  firstname: '',
  middlename: '',
  lastname: '',
  email: '',
  username: '',
  course: '',
  yearlevel: '',
  poke_icon: '',
  sitin_purpose: '',
  sitin_laboratory: '',
  sitin_timein: '',
})

let interval: any
const currentSitins = ref<CurrentSitin[]>([])

const isOpen = ref(false)

const currentTime = ref()

const setIsOpen = (bool: boolean) => {
  isOpen.value = bool
  currentTime.value = getCurrentDate()
  interval = setInterval(() => {
    currentTime.value = getCurrentDate()
  }, 1000)
}

const filteredSitins = computed(() => {
  if (!search.value) return currentSitins.value;
  return currentSitins.value.filter((student) => {
    return (
      student.firstname.toLowerCase().includes(search.value.toLowerCase()) ||
      student.lastname.toLowerCase().includes(search.value.toLowerCase()) ||
      String(student.idno).toLowerCase().includes(search.value.toLowerCase()) || // Convert to string
      student.username.toLowerCase().includes(search.value.toLowerCase()) ||
      student.email.toLowerCase().includes(search.value.toLowerCase()) ||
      student.course.toLowerCase().includes(search.value.toLowerCase()) ||
      student.yearlevel.toLowerCase().includes(search.value.toLowerCase()) ||
      student.middlename.toLowerCase().includes(search.value.toLowerCase()) ||
      student.sitin_purpose.toLowerCase().includes(search.value.toLowerCase()) ||
      String(student.sitin_laboratory).toLowerCase().includes(search.value.toLowerCase()) ||
      student.sitin_timein.toLowerCase().includes(search.value.toLowerCase())
    );
  });
});
function closeModal() {
  isOpen.value = false
  clearInterval(interval)
}

onBeforeMount(async () => {
  const response = await getCurrentSitin()
  if (response.success) {
    currentSitins.value = response.sitins
  }
})
const handleAddPoint = async () => {
  const response = await addPoint(currentStudentSitin.value.sitin_id)
  if (response.success) {
    successToast('Point added successfully!')
    await addSessionFromPoint(currentStudentSitin.value.idno)
    await postNotification(currentStudentSitin.value.idno,"Sit-In Point Received","You received a point from your sitin.","system")

  } else {
    errorToast('Error adding point!')
  }
}
const handleLogoutSitin = async () => {
  const response = await logoutSitin(currentStudentSitin.value.sitin_id)
  if (response.success) {
    
    if (pointChecked.value) {
      console.log('pointChecked', pointChecked.value)
      await handleAddPoint()
    }
    successToast('Student Sit-in logged out successfully!')
    currentSitins.value = currentSitins.value.filter((e) => e.sitin_id !== currentStudentSitin.value.sitin_id)
    pointChecked.value = false
    closeModal()
  } else {
    errorToast('Error logging out student!')
  }
}
const handleCheckPoint = () => {
  pointChecked.value = !pointChecked.value
}
</script>
<template>

  <div class="items-center justify-start min-h-screen max-w-screen flex flex-col pt-10">
    <div class="w-full flex justify-between px-25 mt-25 mb-20">
      <p class="font-bold text-5xl">CURRENT SITINS</p>
      <div class="w-1/3 flex">
        <input v-model="search" placeholder="Search For Seated Student" class="peer w-full placeholder:text-[#8e8e8e] text-lg py-2 px-4 pl-11.5 outline-none border-1 border-transparent bg-[#2e2e2e] transition-all duration-300 focus:border-primary rounded-md" type="text">
        <i class="pi pi-search absolute pt-3.75 pl-4 pointer-events-none transition-all duration-300 peer-focus:text-primary"></i>
      </div>
    </div>
    <div
      v-if="filteredSitins.length !== 0"
      class="justify-center min-h-[20vh]  px-20 p-10 max-w-screen flex flex-wrap gap-10 grow gap-x-20"
    >
      <SitinCard
        @click="
          () => {
            currentStudentSitin = currentSitin
            setIsOpen(true)
          }
        "
        v-for="currentSitin in filteredSitins"
        :key="currentSitin.sitin_id"
        :currentSitin="currentSitin"
      />
    </div>
    <div v-else  class="justify-center items-center h-150 flex">
      <p class="text-4xl font-bold">NO CURRENT SITIN</p>
    </div>
  </div>
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
              class="text-lg flex justify-center items-center w-225 h-150 bg-[#2e2e2e] transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all"
            >
              <div
                class="flex flex-col items-center w-1/2 h-[calc(100%-10px)] border-r-2 border-[#202020]"
              >
                <div
                  :style="{ backgroundImage: toBase64(currentStudentSitin.poke_icon) }"
                  class="mb-7.5 shadow-md shadow-black/50 size-50 bg-contain bg-[#252525] border-4 border-[#1d1d1d] rounded-full"
                ></div>
                <div class="w-[85%] h-[4px] bg-[#1f1f1f]"></div>
                <div class="text-2xl p-1.5 text-[#00BD7E] font-bold flex items-center">
                  {{ currentStudentSitin.idno }}
                </div>

                <div class="w-[85%] h-[4px] bg-[#1f1f1f]"></div>
                <div class="w-[82.5%] flex flex-col gap-3 mt-5">
                  <div class="flex flex-row w-full justify-between my-1">
                    <p>FULL NAME</p>
                    <p>
                      {{ currentStudentSitin.firstname }} {{ currentStudentSitin.middlename }}
                      {{ currentStudentSitin.lastname }}
                    </p>
                  </div>
                  <div class="flex flex-row w-full justify-between my-1">
                    <p>EMAIL</p>
                    <p>{{ currentStudentSitin.email }}</p>
                  </div>
                  <div class="flex flex-row w-full justify-between my-1">
                    <p>USERNAME</p>
                    <p>{{ currentStudentSitin.username }}</p>
                  </div>
                  <div class="flex flex-row w-full justify-between my-1">
                    <p>COURSE</p>
                    <p>{{ currentStudentSitin.course }}</p>
                  </div>
                  <div class="flex flex-row w-full justify-between my-1">
                    <p>YEAR LEVEL</p>
                    <p>{{ currentStudentSitin.yearlevel }}</p>
                  </div>
                </div>
              </div>
              <div
                class="flex items-center flex-col w-1/2 h-[calc(100%-10px)] border-l-2 border-[#202020]"
              >
                <!-- <div class="flex mb-2 w-[85%]">
                  <h1 class="text-2xl font-bold">REMAINING SESSIONS</h1>
                </div>
                <div class="flex w-[85%] mt-5">
                  <div class="flex flex-col h-40 justify-center items-center">
                    <div class="size-40 z-10">
                      <Doughnut :data="data" :options="options" />
                    </div>
                    <div class="size-40 -mt-40">
                      <Doughnut :data="staticData" :options="staticOptions" />
                    </div>
                    <div class="absolute text-3xl text-[#00BD7E] font-bold flex items-center">
                      {{ percent }}%
                    </div>
                  </div>
                  <div class="flex flex-col ml-5 gap-2.5">
                    <div class="text-8xl font-bold flex">{{ remaining }}</div>
                    <p class="ml-1 text-3xl font-bold flex items-center">OUT OF 30</p>
                  </div>
                </div>
                <div class="w-[85%] h-[4px] mt-7.5 bg-[#1f1f1f]"></div>
                <div class="w-[85%] flex flex-col gap-5 mt-7.5">
                  <Input
                    placeholder="Purpose"
                    v-model="state.sitin_purpose"
                    type="text"
                    class="w-full my-3"
                  />

                  <div class="w-full h-10 relative mt-[1px]">
                    <select
                      v-model="state.sitin_laboratory"
                      name="laboratory"
                      class="h-full my-[calc(var(--spacing)*2.28)] px-2 w-full outline-none placeholder:text-[#8e8e8e]"
                    >
                      <option
                        v-for="laboratory in laboratories"
                        :key="laboratory"
                        :value="laboratory"
                        class="text-[#f8f8f8] bg-[#181818] outline-none"
                      >
                        {{ laboratory }}
                      </option>
                    </select>
                    <div
                      class="absolute top-0 w-full h-full pb-7.75 pt-4.75 border-b-2 border-[#3e3e3e] px-2 text-[#8e8e8e] pointer-events-none"
                    >
                      {{ state.sitin_laboratory ? '' : 'Laboratory' }}
                    </div>
                  </div>
                </div> -->

                <div class="w-[85%] mt-5 gap-3 flex flex-col items-center">
                  <p class="text-4xl font-semibold">SIT-IN DETAILS</p>
                </div>
                <div class="w-[85%] mt-15 gap-10 flex flex-col">
                  <div class="flex flex-row w-full justify-between my-1">
                    <p>LABORATORY</p>
                    <p>{{ currentStudentSitin.sitin_laboratory }}</p>
                  </div>
                  <div class="flex flex-row w-full justify-between my-1">
                    <p>PURPOSE</p>
                    <p>{{ currentStudentSitin.sitin_purpose }}</p>
                  </div>
                  <div class="flex flex-row w-full justify-between my-1">
                    <p>TIME IN</p>
                    <p>{{ setDate(currentStudentSitin.sitin_timein) }}</p>
                  </div>
                  <div class="flex flex-row w-full justify-between my-1">
                    <p>TIME OUT</p>
                    <p>{{ currentTime }}</p>
                  </div>
                  <div class="flex flex-row w-full justify-between my-1">
                    <p>REWARD</p>
                    <div class="flex flex-row w-1/3 justify-end my-1">
                      <p class="mr-4">{{ pointChecked ? '1 POINT' : '0  POINT' }}</p>
                      <i v-if="!pointChecked" @click="handleCheckPoint" class="pi pi-star cursor-pointer text-2xl" style="color: green"></i>
                      <i v-else @click="handleCheckPoint" class="pi pi-star-fill cursor-pointer text-2xl" style="color: green"></i>

                    </div>
                  </div>
                </div>
                <div class="w-[85%] mt-7.5">
                  <button
                    @click="handleLogoutSitin"
                    class="focus:outline-none w-full px-5 py-2 rounded text-[#ffff] font-semibold cursor-pointer text-lg bg-[#00BD7E] hover:bg-[#00BD7E]/65 transition-colors duration-400"
                  >
                    LOGOUT
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
