<template>
  <div class="max-w-screen min-h-screen bg-[#181818] text-gray-200 pt-20">
    <div class="p-6 ml-10">
      <div class="flex flex-col items-center">
        <!-- Header -->
        <div class="w-[80vw] flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold">Reservation Management</h1>
          <div class="relative">
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="Search reservations..." 
              class="pl-4 pr-4 py-2 rounded-lg bg-[#252525] border border-[#333] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64 placeholder-gray-400 text-md"
            >
          </div>
        </div>

        <!-- Pending Reservations Table -->
        <div class="w-[80vw] bg-[#252525] rounded-xl shadow-lg overflow-hidden mb-8">
          <h2 class="text-xl font-semibold p-4 border-b border-[#333]">Pending Reservations</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-[#333]">
              <thead class="bg-[#2a2a2a]">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-md font-medium text-gray-300 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-md font-medium text-gray-300 uppercase tracking-wider">
                    ID Number
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-md font-medium text-gray-300 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-md font-medium text-gray-300 uppercase tracking-wider">
                    Laboratory
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-md font-medium text-gray-300 uppercase tracking-wider">
                    PC No.
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-md font-medium text-gray-300 uppercase tracking-wider">
                    Time In
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-md font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#333]">
                <tr 
                  v-for="reservation in pendingReservations" 
                  :key="reservation.id"
                  class="hover:bg-[#303030] transition-colors"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-md font-medium">
                    {{ reservation.studentName }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-md text-gray-400">
                    {{ reservation.idno }}
                  </td>
                  <td class="px-6 py-4 text-md max-w-xs truncate">
                    {{ reservation.purpose }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-md">
                    {{ reservation.laboratory }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-md">
                    {{ reservation.pcno }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-md">
                    {{ formatTime(reservation.timeIn) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-md">
                    <div class="flex gap-2">
                      <Button @click="openReservationDetails(reservation)" variant="outline" class="text-xs">
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="pendingReservations.length === 0" class="p-12 text-center w-full">
            <h3 class="mt-2 text-md font-medium">No pending reservations</h3>
          </div>
        </div>

        <!-- Reservation Logs Table -->
        <div class="w-[80vw] bg-[#252525] rounded-xl shadow-lg overflow-hidden">
          <h2 class="text-xl font-semibold p-4 border-b border-[#333]">Reservation Logs</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-[#333]">
              <thead class="bg-[#2a2a2a]">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-md font-medium text-gray-300 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-md font-medium text-gray-300 uppercase tracking-wider">
                    ID Number
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-md font-medium text-gray-300 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-md font-medium text-gray-300 uppercase tracking-wider">
                    Laboratory
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-md font-medium text-gray-300 uppercase tracking-wider">
                    PC No.
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-md font-medium text-gray-300 uppercase tracking-wider">
                    Time In
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-md font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-md font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#333]">
                <tr 
                  v-for="reservation in filteredReservations" 
                  :key="reservation.id"
                  class="hover:bg-[#303030] transition-colors"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-md font-medium">
                    {{ reservation.studentName }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-md text-gray-400">
                    {{ reservation.idno }}
                  </td>
                  <td class="px-6 py-4 text-md max-w-xs truncate">
                    {{ reservation.purpose }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-md">
                    {{ reservation.laboratory }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-md">
                    {{ reservation.pcno }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-md">
                    {{ formatTime(reservation.timeIn) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-md" 
                    :class="{
                      'text-primary': reservation.status === 'Active',
                      'text-gray-300': reservation.status === 'Completed',
                      'text-red-400': reservation.status === 'Cancelled'
                    }">
                    {{ reservation.status }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-md">
                    <Button @click="openReservationDetails(reservation)" variant="outline" class="text-xs">
                      View
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="filteredReservations.length === 0" class="p-12 text-center w-full">
            <h3 class="mt-2 text-md font-medium">No reservation logs found</h3>
            <p class="mt-1 text-md text-gray-400">Try adjusting your search query</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Reservation Details Dialog -->
<Dialog v-model:open="isDialogOpen">
  <DialogContent class="sm:max-w-[500px] max-h-[80vh] bg-[#252525] border-[#333] text-gray-200 overflow-y-auto">
    <DialogHeader>
      <DialogTitle class="text-2xl">Reservation Details</DialogTitle>
      <DialogDescription class="text-gray-400">
        View full details of this reservation
      </DialogDescription>
    </DialogHeader>
    <div class="space-y-5 py-4 px-4">
      <!-- Student Information Section -->
      <div class="space-y-4 pb-4 border-b border-[#333]">
        <h3 class="text-lg font-semibold text-gray-300">Student Information</h3>
        <div class="flex justify-between items-center">
          <span class="text-gray-400">ID Number</span>
          <span class="font-medium">{{ selectedReservation?.idno }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-400">Student Name</span>
          <span class="font-medium">{{ selectedReservation?.studentName }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-400">Email</span>
          <span class="font-medium">{{ selectedReservation?.email || 'N/A' }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-400">Username</span>
          <span class="font-medium">{{ selectedReservation?.username || 'N/A' }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-400">Year Level</span>
          <span class="font-medium">{{ selectedReservation?.yearLevel || 'N/A' }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-400">Course</span>
          <span class="font-medium">{{ selectedReservation?.course || 'N/A' }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-400">Remaining Sessions</span>
          <span class="font-medium">{{ selectedReservation?.remainingSessions ?? 'N/A' }}</span>
        </div>
      </div>

      <!-- Reservation Information Section -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-300">Reservation Information</h3>
        <div class="flex justify-between items-start">
          <span class="text-gray-400">Purpose</span>
          <span class="font-medium text-right max-w-[60%]">{{ selectedReservation?.purpose }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-400">Laboratory</span>
          <span class="font-medium">{{ selectedReservation?.laboratory }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-400">PC Number</span>
          <span class="font-medium">{{ selectedReservation?.pcno }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-400">Time In</span>
          <span class="font-medium">{{ selectedReservation ? formatTime(selectedReservation.timeIn) : '' }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-400">Status</span>
          <span class="font-medium" 
            :class="{
              'text-primary': selectedReservation?.status === 'Active',
              'text-gray-300': selectedReservation?.status === 'Completed',
              'text-red-400': selectedReservation?.status === 'Cancelled',
              'text-yellow-400': selectedReservation?.status === 'Pending'
            }">
            {{ selectedReservation?.status }}
          </span>
        </div>
      </div>
    </div>
    <DialogFooter v-if="selectedReservation?.status === 'Pending'" class="px-6 pb-6">
      <Button @click="approveReservation(selectedReservation.id)" class="bg-[#00BD7E] hover:bg-[#00BD7E]/90">
        Approve
      </Button>
      <Button @click="rejectReservation(selectedReservation.id)" variant="destructive">
        Reject
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface Reservation {
  id: string
  idno: string
  studentName: string
  email?: string
  username?: string
  yearLevel?: string
  course?: string
  remainingSessions?: number
  purpose: string
  laboratory: string
  pcno: string
  timeIn: string
  status: string
}

// Sample data for pending reservations
const pendingReservations = ref<Reservation[]>([
  {
    id: '6',
    idno: '2020-00678',
    studentName: 'Maria Garcia',
    purpose: 'Software Development',
    laboratory: 'Computer Lab 2',
    pcno: 'B-03',
    timeIn: '2023-05-16T10:00:00',
    status: 'Pending'
  },
  {
    id: '7',
    idno: '2020-00789',
    studentName: 'John Doe',
    purpose: 'Data Science Project',
    laboratory: 'Computer Lab 1',
    pcno: 'A-05',
    timeIn: '2023-05-16T11:30:00',
    status: 'Pending'
  }
])

// Modified sample data for reservation logs (with student info)
const reservations = ref<Reservation[]>([
  {
    id: '1',
    idno: '2020-00123',
    studentName: 'Juan Dela Cruz',
    purpose: 'Thesis Research - Machine Learning Implementation',
    laboratory: 'Computer Lab 1',
    pcno: 'A-12',
    timeIn: '2023-05-15T09:30:00',
    status: 'Active'
  },
  {
    id: '2',
    idno: '2020-00456',
    studentName: 'Maria Santos',
    purpose: 'Capstone Project - Database Development',
    laboratory: 'Computer Lab 2',
    pcno: 'B-05',
    timeIn: '2023-05-14T14:15:00',
    status: 'Active'
  },
  {
    id: '3',
    idno: '2020-00321',
    studentName: 'Pedro Reyes',
    purpose: 'Programming Practice',
    laboratory: 'Computer Lab 3',
    pcno: 'C-21',
    timeIn: '2023-05-13T10:45:00',
    status: 'Completed'
  },
  {
    id: '4',
    idno: '2020-00567',
    studentName: 'Anna Lopez',
    purpose: 'Data Analysis for Research',
    laboratory: 'Computer Lab 1',
    pcno: 'A-08',
    timeIn: '2023-05-12T13:20:00',
    status: 'Cancelled'
  },
  {
    id: '5',
    idno: '2020-00234',
    studentName: 'Luis Garcia',
    purpose: 'Network Configuration Project',
    laboratory: 'Networking Lab',
    pcno: 'N-03',
    timeIn: '2023-05-11T08:00:00',
    status: 'Active'
  },
])

const searchQuery = ref('')
const isDialogOpen = ref(false)
const selectedReservation = ref<Reservation | null>(null)

// Computed properties
const filteredReservations = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return reservations.value.filter(reservation => 
    reservation.purpose.toLowerCase().includes(query) ||
    reservation.laboratory.toLowerCase().includes(query) ||
    reservation.pcno.toLowerCase().includes(query) ||
    reservation.studentName.toLowerCase().includes(query) ||
    reservation.idno.toLowerCase().includes(query)
  )
})

// Methods
function formatTime(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function openReservationDetails(reservation: Reservation) {
  selectedReservation.value = reservation
  isDialogOpen.value = true
}

function approveReservation(id: string) {
  const index = pendingReservations.value.findIndex(r => r.id === id)
  if (index !== -1) {
    const approvedReservation = { ...pendingReservations.value[index], status: 'Active' }
    reservations.value.unshift(approvedReservation)
    pendingReservations.value.splice(index, 1)
    isDialogOpen.value = false
  }
}

function rejectReservation(id: string) {
  const index = pendingReservations.value.findIndex(r => r.id === id)
  if (index !== -1) {
    const rejectedReservation = { ...pendingReservations.value[index], status: 'Cancelled' }
    reservations.value.unshift(rejectedReservation)
    pendingReservations.value.splice(index, 1)
    isDialogOpen.value = false
  }
}
</script>