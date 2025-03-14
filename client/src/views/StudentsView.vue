<script setup lang="ts">
import StudentCard from '@/components/StudentCard.vue'
import { ref, computed, reactive, onBeforeMount } from 'vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { Chart as ChartJS, ArcElement } from 'chart.js'
import AdminNavbar from '@/components/AdminNavbar.vue'
import { Doughnut } from 'vue-chartjs'
import Input from '@/components/ui/TextField.vue'
import { getStudents } from '@/api/student'
import { toBase64 } from '@/library/base64'
import { addSitIn } from '@/api/sitin'
import { errorToast, successToast } from '@/library/toast'
import type { Student } from '@/types/Student'



const search = ref("")
const students = ref<Student[]>([])
const currentStudent = ref<Student>({
  idno: '',
  firstname: '',
  middlename: '',
  lastname: '',
  course: '',
  yearlevel: '',
  email: '',
  username: '',
  password: '',
  sessions: '',
  poke_icon: '',
})

onBeforeMount(async () => {
  const response = await getStudents()
  if (response.success) {
    students.value = response.students
  }
})

const filteredStudents = computed(() => {
  if (!search.value) return students.value;
  return students.value.filter((student) => {
    return (
      student.firstname.toLowerCase().includes(search.value.toLowerCase()) ||
      student.lastname.toLowerCase().includes(search.value.toLowerCase()) ||
      String(student.idno).toLowerCase().includes(search.value.toLowerCase()) || // Convert to string
      student.username.toLowerCase().includes(search.value.toLowerCase()) ||
      student.email.toLowerCase().includes(search.value.toLowerCase()) ||
      student.course.toLowerCase().includes(search.value.toLowerCase()) ||
      student.yearlevel.toLowerCase().includes(search.value.toLowerCase()) ||
      student.middlename.toLowerCase().includes(search.value.toLowerCase())
    );
  });
});


const isOpen = ref(false)
const laboratories = ['524', '526', '528', '530', '542', '544']

// const percent = computed(
//   () => Math.round(Number(currentStudent.value.sessions) / 30) * 100,
// )
const remaining = ref(0)
const percent = ref(0)

const state = reactive({
  sitin_purpose: '',
  sitin_laboratory: '',
})
const data = computed(() => ({
  labels: ['Sessions', ''],
  datasets: [
    {
      borderWidth: 0,
      backgroundColor: ['#00BD7E', '#202020'],
      data: [Number(currentStudent.value.sessions), 30 - Number(currentStudent.value.sessions)],
      weight: 5,
    },
  ],
}))
const staticData = {
  labels: ['Sessions'],
  datasets: [
    {
      borderWidth: 0,
      backgroundColor: ['#202020'],
      data: [30],
      weight: 5,
    },
  ],
}
const staticOptions = {
  backgroundColor: '#202020',
  cutout: '75%',
  animation: false,
  maintainAspectRatio: false,
}

const options = {
  backgroundColor: '#202020',
  cutout: '75%',
  maintainAspectRatio: false,
}

function setIsOpen(value: boolean) {
  isOpen.value = value
  let percentage = Math.round((Number(currentStudent.value.sessions) / 30) * 100)
  console.log('percentage', percentage)
  console.log('currentStudent', currentStudent.value.sessions)
  percent.value = 0
  remaining.value = 0 // Reset to 0 before animation starts
  state.sitin_purpose = ''
  state.sitin_laboratory = ''
  let currentValue = 0
  let currentPercentValue = 0
  const interval = setInterval(
    () => {
      currentValue += 1
      if (currentValue > Number(currentStudent.value.sessions)) {
        currentValue = Number(currentStudent.value.sessions)
        clearInterval(interval)
      }
      remaining.value = currentValue
    },
    (Number(currentStudent.value.sessions) / 30) * 20,
  )
  const percentInterval = setInterval(
    () => {
      currentPercentValue += 1
      if (currentPercentValue > percentage) {
        currentPercentValue = percentage
        clearInterval(percentInterval)
      }
      percent.value = currentPercentValue
    },
    (percentage / 1000),
  )
}

function closeModal() {
  isOpen.value = false
}
function openModal() {
  isOpen.value = true
}


const handleSitin = async () => {
  if(state.sitin_purpose === '' || state.sitin_laboratory === '') {
    errorToast('Please fill out all the fields')
    return
  }
  const newSitin = {
    idno: currentStudent.value.idno,
    sitin_purpose: state.sitin_purpose,
    sitin_laboratory: state.sitin_laboratory,
  }
  console.log(newSitin)
  const response = await addSitIn(newSitin)

  if (response.success) {
    successToast('Sit-in added successfully')
    closeModal()
    students.value.map((student) => {
      if (student.idno === currentStudent.value.idno) {
        student.sessions = String(Number(student.sessions) - 1)
      }
      return student
    })
  } else {
    errorToast('Student is already seated-in')
  }
}
ChartJS.register(ArcElement)
</script>

<template>
    <AdminNavbar/>

  <div class="items-center justify-center min-h-screen w-screen pt-10">
    <div class="w-full flex justify-between px-25 mt-25 mb-20">
      <p class="font-bold text-5xl">STUDENTS</p>
      <div class="w-1/3 flex">
        <input v-model="search" placeholder="Search For Student" class="peer w-full placeholder:text-[#8e8e8e] text-lg py-2 px-4 pl-11.5 outline-none border-1 border-transparent bg-[#2e2e2e] transition-all duration-300 focus:border-primary rounded-md" type="text">
        <i class="pi pi-search absolute pt-3.75 pl-4 pointer-events-none transition-all duration-300 peer-focus:text-primary"></i>
      </div>
    </div>
    <div v-if="filteredStudents.length !== 0" class="justify-center min-h-screen px-20 p-10 max-w-screen flex flex-wrap gap-10 grow gap-x-20">
      <StudentCard
        @click="
          () => {
              currentStudent = student
            setIsOpen(true)
          }
        "
        v-for="student in filteredStudents"
        :key="student.idno"
        :student="student"
      />
    </div>
    <div v-else  class="justify-center items-center h-150 flex">
      <p class="text-4xl font-bold">NO STUDENT FOUND</p>
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
                  :style="{ backgroundImage: toBase64(currentStudent.poke_icon) }"
                  class="mb-7.5 shadow-md shadow-black/50 size-50 bg-contain bg-[#252525] border-4 border-[#1d1d1d] rounded-full"
                ></div>
                <div class="w-[85%] h-[4px] bg-[#1f1f1f]"></div>
                <div class="text-2xl p-1.5 text-[#00BD7E] font-bold flex items-center">
                  {{ currentStudent.idno }}
                </div>

                <div class="w-[85%] h-[4px] bg-[#1f1f1f]"></div>
                <div class="w-[82.5%] flex flex-col gap-3 mt-5">
                  <div class="flex flex-row w-full justify-between my-1">
                    <p>FULL NAME</p>
                    <p>
                      {{ currentStudent.firstname }} {{ currentStudent.middlename }}
                      {{ currentStudent.lastname }}
                    </p>
                  </div>
                  <div class="flex flex-row w-full justify-between my-1">
                    <p>EMAIL</p>
                    <p>{{ currentStudent.email }}</p>
                  </div>
                  <div class="flex flex-row w-full justify-between my-1">
                    <p>USERNAME</p>
                    <p>{{ currentStudent.username }}</p>
                  </div>
                  <div class="flex flex-row w-full justify-between my-1">
                    <p>COURSE</p>
                    <p>{{ currentStudent.course }}</p>
                  </div>
                  <div class="flex flex-row w-full justify-between my-1">
                    <p>YEAR LEVEL</p>
                    <p>{{ currentStudent.yearlevel }}</p>
                  </div>
                </div>
              </div>
              <div
                class="flex items-center flex-col w-1/2 h-[calc(100%-10px)] border-l-2 border-[#202020]"
              >
                <div class="flex mb-2 w-[85%]">
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
                </div>
                <div class="w-[85%] mt-15">
                  <button
                    @click="handleSitin"
                    class="w-full px-5 py-2 rounded text-[#ffff] font-semibold cursor-pointer text-lg bg-[#00BD7E] hover:bg-[#00BD7E]/65 transition-colors duration-400"
                  >
                    CONFIRM SIT-IN
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
