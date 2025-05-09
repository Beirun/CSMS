<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { getLabSchedule, updateSchedule } from '@/api/labschedule'

type LabSchedule = {
  id: number,
  lab_number: string,
  days: string,
  time: string,
  status: string
}

const labSchedules = ref<LabSchedule[]>([])
const selectedLab = ref('')
const isLoading = ref(false)

const timeSlots = [
  "7:30-8:00", "8:00-8:30", "8:30-9:00", "9:00-9:30", "9:30-10:00",
  "10:00-10:30", "10:30-11:00", "11:00-11:30", "11:30-12:00", 
  "12:00-12:30", "12:30-13:00", "13:00-13:30", "13:30-14:00", 
  "14:00-14:30", "14:30-15:00", "15:00-15:30", "15:30-16:00", 
  "16:00-16:30", "16:30-17:00", "17:00-17:30", "17:30-18:00", 
  "18:00-18:30", "18:30-19:00", "19:00-19:30", "19:30-20:00", 
  "20:00-20:30", "20:30-21:00"
]
const schedule = ref<Record<string, Record<string, string>>>({})

const days = [
  { key: 'monWed', label: 'Mon/Wed' },
  { key: 'tuesThurs', label: 'Tue/Thu' },
  { key: 'fri', label: 'Friday' },
  { key: 'sat', label: 'Saturday' }
]

const labs = ['517', '524', '526', '528', '530', '542', '544']

const toggleLab = async (lab: string) => {
  isLoading.value = true
  selectedLab.value = lab
  
  try {
    const response = await getLabSchedule(lab)
    labSchedules.value = response.lab_sched as LabSchedule[]
    
    timeSlots.forEach(time => {
      schedule.value[time] = {
        monWed: labSchedules.value.find(s => s.time === time && s.days === 'monWed')?.status || 'Closed',
        tuesThurs: labSchedules.value.find(s => s.time === time && s.days === 'tuesThurs')?.status || 'Closed',
        fri: labSchedules.value.find(s => s.time === time && s.days === 'fri')?.status || 'Closed',
        sat: labSchedules.value.find(s => s.time === time && s.days === 'sat')?.status || 'Closed'
      }
    })
  } catch (error) {
    console.error("Error fetching schedule:", error)
  } finally {
    isLoading.value = false
  }
}

const toggleSlot = async (lab: string, day: string, time: string) => {
  const newStatus = schedule.value[time][day] === 'Open' ? 'Closed' : 'Open'
  schedule.value[time][day] = newStatus
  
  try {
    await updateSchedule(lab, time, day, newStatus)
  } catch (error) {
    console.error("Error updating schedule:", error)
    // Revert on error
    schedule.value[time][day] = schedule.value[time][day] === 'Open' ? 'Closed' : 'Open'
  }
}

onBeforeMount(async () => {
  await toggleLab('517')
})
</script>

<template>
  <div class="min-h-screen bg-[#181818] p-6 text-gray-100">
    <!-- Header -->
    <header class="max-w-7xl mx-auto mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">Laboratory Schedule Management</h1>
      <p class="text-gray-400">View and manage laboratory availability</p>
    </header>

    <div class="max-w-7xl mx-auto">
      <!-- Lab Selector -->
      <div class="mb-8">
        <h2 class="text-lg font-medium text-gray-300 mb-3">Select Laboratory</h2>
        <div class="flex flex-wrap gap-3">
          <button
            v-for="lab in labs"
            :key="lab"
            @click="toggleLab(lab)"
            :class="[
              'px-5 py-2 rounded-lg border transition-all duration-200',
              selectedLab === lab 
                ? 'bg-[#00BD7E] text-white border-[#00BD7E] shadow-md hover:bg-[#00a86f]'
                : 'bg-[#222222] text-gray-300 border-gray-700 hover:border-[#00BD7E] hover:bg-[#252525]'
            ]"
          >
            Lab {{ lab }}
          </button>
        </div>
      </div>

      <!-- Schedule Table -->
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00BD7E]"></div>
      </div>

      <div v-else-if="selectedLab" class="bg-[#222222] rounded-xl shadow-lg overflow-hidden border border-gray-800">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-700">
            <thead class="bg-[#252525]">
              <tr>
                <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Time Slot
                </th>
                <th 
                  v-for="day in days"
                  :key="day.key"
                  scope="col" 
                  class="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  {{ day.label }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-800">
              <tr v-for="time in timeSlots" :key="time" class="hover:bg-[#282828] transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                  {{ time }}
                </td>
                <td 
                  v-for="day in days"
                  :key="day.key"
                  class="px-6 py-4 whitespace-nowrap text-center"
                >
                  <button
                    @click="toggleSlot(selectedLab, day.key, time)"
                    :class="[
                      'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                      schedule[time][day.key] === 'Open'
                        ? 'bg-[#00BD7E]/20 text-[#00BD7E] hover:bg-[#00BD7E]/30 border border-[#00BD7E]/30'
                        : 'bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-800/50'
                    ]"
                  >
                    {{ schedule[time][day.key] }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="bg-[#222222] rounded-xl shadow-lg p-12 text-center border border-gray-800">
        <div class="mx-auto max-w-md">
          <svg class="mx-auto h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="mt-2 text-lg font-medium text-gray-200">No laboratory selected</h3>
          <p class="mt-1 text-gray-500">Please select a laboratory to view its schedule</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Smooth scrolling for table */
.table-container {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #282828;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Custom glow effect for primary color */
.glow-primary {
  box-shadow: 0 0 10px rgba(0, 189, 126, 0.5);
}

.hover-glow-primary:hover {
  box-shadow: 0 0 15px rgba(0, 189, 126, 0.7);
}
</style>