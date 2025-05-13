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
                  <th scope="col" class="pl-20 px-6 py-3 text-left text-md font-medium text-gray-300 uppercase tracking-wider">
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
                    {{ reservation.firstname }} {{ reservation.middlename }} {{ reservation.lastname }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-md text-gray-400">
                    {{ reservation.idno }}
                  </td>
                  <td class="px-6 py-4 text-md max-w-xs truncate">
                    {{ reservation.purpose }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-md">
                    {{ reservation.labno }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-md">
                    {{ reservation.pcno }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-md">
                    {{ formatDate(reservation.timein.slice(0,10)) }} {{ reservation.timein.slice(11) }}
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
                    {{ reservation.firstname }} {{ reservation.middlename }} {{ reservation.lastname }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-md text-gray-400">
                    {{ reservation.idno }}
                  </td>
                  <td class="px-6 py-4 text-md max-w-xs truncate">
                    {{ reservation.purpose }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-md">
                    {{ reservation.labno }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-md">
                    {{ reservation.pcno }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-md">
                    {{ formatTime(reservation.timein) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-md" 
                  :class="{
                        'text-yellow-500/70': reservation.status === 'Pending',
                        'text-red-500/70': reservation.status === 'Disapproved',
                        'text-green-500/70': reservation.status === 'Approved'
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
          <span class="font-medium">{{ selectedReservation?.firstname }} {{ selectedReservation?.middlename }} {{ selectedReservation?.lastname }}</span>
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
          <span class="font-medium">{{ selectedReservation?.yearlevel || 'N/A' }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-400">Course</span>
          <span class="font-medium">{{ selectedReservation?.course || 'N/A' }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-400">Remaining Sessions</span>
          <span class="font-medium">{{ selectedReservation?.sessions ?? 'N/A' }}</span>
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
          <span class="font-medium">{{ selectedReservation?.labno }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-400">PC Number</span>
          <span class="font-medium">{{ selectedReservation?.pcno }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-400">Time In</span>
          <span class="font-medium">{{ selectedReservation ? formatDate(selectedReservation.timein.slice(0,10)) + ' ' + selectedReservation.timein.slice(11) : '' }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-400">Status</span>
          <span class="font-medium" 
            :class="{
                        'text-yellow-500/50': selectedReservation?.status === 'Pending',
                        'text-red-500/50': selectedReservation?.status === 'Disapproved',
                        'text-green-500/50': selectedReservation?.status === 'Approved'
                      }">
            {{ selectedReservation?.status }}
          </span>
        </div>
      </div>
    </div>
    <DialogFooter v-if="selectedReservation?.status === 'Pending'" class="px-6 pb-6">
      <Button @click="approveReservation(selectedReservation)" class="bg-[#00BD7E] hover:bg-[#00BD7E]/90">
        Approve
      </Button>
      <Button @click="rejectReservation(selectedReservation.id)" variant="destructive">
        Disapprove
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
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
import {getReservations, updateReservation} from '@/api/reservation'
import type { StudentReservation } from '@/types/Reservation'
import { errorToast, successToast } from '@/library/toast'
import { addSitIn } from '@/api/sitin'
import { updatePC } from '@/api/pc'
import { type PC } from '@/types/PC'

onBeforeMount(async () => {
  const response = await getReservations()
  console.log(response)
  reservations.value = response.reservation
  pendingReservations.value = reservations.value.filter(reservation => reservation.status === 'Pending')
  reservationLogs.value = reservations.value.filter(reservation => reservation.status !== 'Pending')
  if (response.success) {
    // reservations.value = response.reservations
  }
})

// Sample data for pending reservations
const reservations = ref<StudentReservation[]>([])
const reservationLogs = ref<StudentReservation[]>([])
const pendingReservations = ref<StudentReservation[]>([])

const searchQuery = ref('')
const isDialogOpen = ref(false)
const selectedReservation = ref<StudentReservation | null>(null)

// Computed properties
const filteredReservations = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return reservationLogs.value.filter(reservation => 
    reservation.purpose.toLowerCase().includes(query) ||
    reservation.labno.toLowerCase().includes(query) ||
    reservation.pcno.toLowerCase().includes(query) ||
    (reservation.firstname + ' ' + reservation.middlename + ' ' + reservation.lastname).toLowerCase().includes(query) ||
    reservation.idno.toLowerCase().includes(query)
  )
})
function formatDate(date : string) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
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

function openReservationDetails(reservation: StudentReservation) {
  selectedReservation.value = reservation
  isDialogOpen.value = true
}

async function approveReservation(reservation: StudentReservation) {
  const id = reservation.id
  const response = await updateReservation(id, 'Approved')
  if(!response.success) return
    successToast('Reservation Approved')
    const newSitin = {
    idno: reservation.idno,
    sitin_purpose: reservation.purpose,
    sitin_laboratory: reservation.labno,
  }
  console.log(newSitin)
  
  const sitinResponse = await addSitIn(newSitin)

  if (sitinResponse.success) {
    successToast('Sit-in added successfully')
    const updatedPC : PC = {
      pcno: reservation.pcno,
      labno: reservation.labno,
      status: 'Used'
    }
    await updatePC(updatedPC)
    
  } else {
    errorToast('Student is already seated-in')
  }
    isDialogOpen.value = false
    const reservationResponse = await getReservations()
  console.log(response)
  reservations.value = reservationResponse.reservation
  pendingReservations.value = reservations.value.filter(reservation => reservation.status === 'Pending')
  reservationLogs.value = reservations.value.filter(reservation => reservation.status !== 'Pending')
}

async function rejectReservation(id: string) {
    const response = await updateReservation(id, 'Disapproved' )
    if(!response.success) return
    successToast('Reservation Disapproved')
    isDialogOpen.value = false
    const reservationResponse = await getReservations()
  console.log(response)
  reservations.value = reservationResponse.reservation
  pendingReservations.value = reservations.value.filter(reservation => reservation.status === 'Pending')
  reservationLogs.value = reservations.value.filter(reservation => reservation.status !== 'Pending')
}
</script>