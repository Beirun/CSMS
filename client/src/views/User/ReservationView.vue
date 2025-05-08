<template>
    <div class="max-w-screen min-h-screen bg-[#181818] text-gray-200 pt-20">
      <div class="p-6 ml-10">
        <div class="flex flex-col items-center">
          <!-- Header -->
          <div class="w-[80vw] flex justify-between items-center mb-8">
            <div class="flex items-center gap-4">
              <h1 class="text-3xl font-bold">Reservations</h1>
              <Button @click="isDialogOpen = true" class="bg-[#00BD7E] hover:bg-[#00BD7E]/90 flex items-center">
                <PlusIcon class="h-4 w-4 mr-2" />
                Add New
              </Button>
            </div>
            <div class="relative">
              <input 
                type="text" 
                v-model="searchQuery"
                placeholder="Search reservations..." 
                class="pl-4 pr-4 py-2 rounded-lg bg-[#252525] border border-[#333] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64 placeholder-gray-400 text-md"
              >
            </div>
          </div>
  
          <!-- Reservation Table -->
          <div class="w-[80vw] bg-[#252525] rounded-xl shadow-lg overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-[#333]">
                <thead class="bg-[#2a2a2a]">
                  <tr>
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
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#333]">
                  <tr 
                    v-for="reservation in filteredReservations" 
                    :key="reservation.id"
                    class="hover:bg-[#303030] transition-colors"
                  >
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
                  </tr>
                </tbody>
              </table>
            </div>
  
            <!-- Empty State -->
            <div v-if="filteredReservations.length === 0" class="p-12 text-center w-full">
              <h3 class="mt-2 text-md font-medium">No reservations found</h3>
              <p class="mt-1 text-md text-gray-400">Try adjusting your search query</p>
            </div>
          </div>
  
           <!-- Add Reservation Dialog -->

  <!-- Add Reservation Dialog -->
  <Dialog v-model:open="isDialogOpen">
    <DialogContent class="sm:max-w-[500px] max-h-[800px] bg-[#252525] border-[#333]">
      <DialogHeader>
        <DialogTitle class="text-gray-200">New Reservation</DialogTitle>
        <DialogDescription class="text-gray-400">
          Fill in the details for the new reservation
        </DialogDescription>
      </DialogHeader>
      
      <div class="grid gap-4 py-4">
        <!-- Student Info (readonly) -->
        <div class="space-y-4 pb-4">
          <div class="flex justify-between items-center w-full">
            <Label class="text-gray-300 w-[45%]">ID No:</Label>
            <span class="text-gray-200 font-medium w-[45%] text-right">{{ currentStudent.idno }}</span>
          </div>
          <div class="flex justify-between items-center w-full">
            <Label class="text-gray-300 w-[45%]">Student Name:</Label>
            <span class="text-gray-200 font-medium w-[45%] text-right">{{ currentStudent.name }}</span>
          </div>
          <div class="flex justify-between items-center w-full">
            <Label class="text-gray-300 w-[45%]">Remaining Sessions:</Label>
            <span class="text-gray-200 font-medium w-[45%] text-right">{{ currentStudent.remainingSessions }}</span>
          </div>
        </div>

        <!-- Purpose and Laboratory in same line -->
        <div class="flex justify-between w-full gap-4 py-2">
          <!-- Purpose Dropdown -->
          <div class="w-[45%]">
            <Label class="text-gray-300 pb-2">Purpose</Label>
            <Select v-model="newReservation.purpose">
              <SelectTrigger class="bg-[#333] cursor-pointer border-[#444] text-gray-200 w-full">
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent class="bg-[#333] border-[#444] text-gray-200">
                <SelectGroup>
                  <SelectLabel>Purposes</SelectLabel>
                  <SelectItem 
                    v-for="purpose in purposes" 
                    :key="purpose" 
                    :value="purpose"
                    class="hover:bg-[#444]"
                  >
                    {{ purpose }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <!-- Laboratory Dropdown with HoverCard for PCs -->
          <div class="w-[45%]">
    <Label class="text-gray-300 pb-2">Laboratory & PC</Label>
    <Select v-model="newReservation.laboratory" :open="laboratoryDropdownOpen" @update:open="handleDropdownOpen">
      <SelectTrigger class="bg-[#333] cursor-pointer border-[#444] text-gray-200 w-full">
        <SelectValue :placeholder="labph" />
      </SelectTrigger>
      <SelectContent class="bg-[#333] border-[#444] text-gray-200">
        <SelectGroup>
          <SelectLabel>Laboratories</SelectLabel>
          <div v-for="lab in laboratories" :key="lab.name">
            <HoverCard :open-delay="0" :close-delay="100">
              <HoverCardTrigger as-child>
                <div :value="lab.name" class=" w-full px-2 py-1.5 text-sm hover:bg-[#444] cursor-default transition-colors duration-100">
                  <span>{{ lab.name }}</span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent 
                class="w-auto p-2 bg-[#333] border-[#444] text-gray-200 transition-opacity duration-100"
                side="right"
                align="start"
              >
                <div class="grid grid-cols-3 gap-2">
                  <Button
                    v-for="pc in lab.pcs"
                    :key="pc"
                    variant="ghost"
                    class="h-8 w-12 p-0 text-xs hover:bg-[#444] transition-colors duration-100"
                    @click="selectPC(lab.name, pc)"
                  >
                    {{ pc }}
                  </Button>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </SelectGroup>
      </SelectContent>
    </Select>
    <div class="mt-2 text-sm text-gray-300 h-10">
      <div v-if="newReservation.pcno">
        <i class="pi pi-desktop text-md px-4"></i><span class="font-medium">PC {{ newReservation.pcno }}</span>
      </div>
    </div>
  </div>
        </div>

        <!-- Date and Time in same line -->
        <div class="flex justify-between w-full gap-4">
          <!-- Date Picker -->
          <div class="w-[45%]">
            <Label class="text-gray-300">Date</Label>
            <Popover>
              <PopoverTrigger as-child>
                <Button
                  class="w-full justify-start text-left font-normal bg-[#222] border-1 border-[#444444] hover:bg-[#333] text-gray-200"
                >
                  <CalendarIcon class="mr-2 h-4 w-4" />
                  <span>{{ newReservation.date ? formatDate(newReservation.date.toString()) : 'Pick a date' }}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0 bg-[#333] border-[#444]">
                <Calendar
                  v-model="newReservation.date as DateValue"
                  mode="single"
                  initial-focus
                  class="text-gray-200"
                />
              </PopoverContent>
            </Popover>
          </div>

          <!-- Time Dropdown (8AM-5PM) -->
          <div class="w-[45%]">
            <Label class="text-gray-300">Time</Label>
            <Select v-model="newReservation.time">
              <SelectTrigger class="cursor-pointer hover:bg-[#444] bg-[#333] border-[#444] text-gray-200 w-full">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent class="bg-[#333] border-[#444] text-gray-200">
                <SelectGroup>
                  <SelectLabel>Available Times</SelectLabel>
                  <SelectItem 
                    v-for="time in timeSlots" 
                    :key="time" 
                    :value="time"
                    class="hover:bg-[#444]"
                  >
                    {{ time }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="isDialogOpen = false" class="border-[#444] text-gray-200 hover:bg-[#444]">
          Cancel
        </Button>
        <Button @click="submitReservation" class="bg-[#00BD7E] hover:bg-[#00BD7E]/90">
          Submit
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import NavbarDashboard from '@/components/StudentSidebar.vue'
  import { PlusIcon, ChevronRightIcon, CalendarIcon } from 'lucide-vue-next'
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog'
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select'
  import { Button } from '@/components/ui/button'
  import { Input } from '@/components/ui/input'
  import { Label } from '@/components/ui/label'
  import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
  import { Calendar } from '@/components/ui/calendar'
  import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { DateValue } from 'reka-ui'
  
  // Current student data (replace with your actual auth data)
  const currentStudent = ref({
    idno: '2020-00123',
    name: 'Juan Dela Cruz',
    remainingSessions: 5
  })
  
  const labph = ref("Select laboratory")
  // Dialog state
  const isDialogOpen = ref(false)
  
  // New reservation form
  const newReservation = ref({
    purpose: '',
    laboratory: '',
    pcno: '',
    date: undefined as DateValue | undefined,
    time: ''
  })
  
  // Sample data
  const purposes = [
    'Thesis Research',
    'Capstone Project',
    'Programming Practice',
    'Data Analysis',
    'Network Configuration'
  ]
  
  const laboratories = [
    {
      name: 'Computer Lab 1',
      pcs: ['A-01', 'A-02', 'A-03', 'A-04', 'A-05', 'A-06', 'A-07', 'A-08']
    },
    {
      name: 'Computer Lab 2',
      pcs: ['B-01', 'B-02', 'B-03', 'B-04', 'B-05', 'B-06']
    },
    {
      name: 'Computer Lab 3',
      pcs: ['C-01', 'C-02', 'C-03', 'C-04', 'C-05']
    },
    {
      name: 'Networking Lab',
      pcs: ['N-01', 'N-02', 'N-03', 'N-04']
    }
  ]
  
  // Time slots from 8AM to 5PM
  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = 8 + i
    return `${hour}:00 - ${hour + 1}:00`
  })
  
  const laboratoryDropdownOpen = ref(false)
const hoveredLab = ref(null)

// Modified selectPC function
function selectPC(labName : string, pc :string) {
  newReservation.value.laboratory = labName
  newReservation.value.pcno = pc
  laboratoryDropdownOpen.value = false
  labph.value = labName
}

// Handle dropdown open state
function handleDropdownOpen(open : boolean) {
  if (!open ) {
    // Don't allow closing if no PC is selected
    laboratoryDropdownOpen.value = !laboratoryDropdownOpen.value
  } else {
    laboratoryDropdownOpen.value = open
  }
}
  
  // Format date for display
  function formatDate(date : string) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
 
  
  // Submit function
  function submitReservation() {
    console.log('Submitting reservation:', {
      ...newReservation.value,
      studentId: currentStudent.value.idno,
      studentName: currentStudent.value.name
    })
    // Add your submission logic here
    isDialogOpen.value = false
    // Reset form
    newReservation.value = {
      purpose: '',
      laboratory: '',
      pcno: '',
      date: undefined,
      time: ''
    }
  }
  
  // Sample data
  const reservations = ref([
    {
      id: '1',
      purpose: 'Thesis Research - Machine Learning Implementation',
      laboratory: 'Computer Lab 1',
      pcno: 'A-12',
      timeIn: '2023-05-15T09:30:00',
      status: 'Active'
    },
    {
      id: '2',
      purpose: 'Capstone Project - Database Development',
      laboratory: 'Computer Lab 2',
      pcno: 'B-05',
      timeIn: '2023-05-14T14:15:00',
      status: 'Active'
    },
    {
      id: '3',
      purpose: 'Programming Practice',
      laboratory: 'Computer Lab 3',
      pcno: 'C-21',
      timeIn: '2023-05-13T10:45:00',
      status: 'Completed'
    },
    {
      id: '4',
      purpose: 'Data Analysis for Research',
      laboratory: 'Computer Lab 1',
      pcno: 'A-08',
      timeIn: '2023-05-12T13:20:00',
      status: 'Cancelled'
    },
    {
      id: '5',
      purpose: 'Network Configuration Project',
      laboratory: 'Networking Lab',
      pcno: 'N-03',
      timeIn: '2023-05-11T08:00:00',
      status: 'Active'
    },
  ])
  const searchQuery = ref('')
  
  // Computed properties
  const filteredReservations = computed(() => {
    const query = searchQuery.value.toLowerCase()
    return reservations.value.filter(reservation => 
      reservation.purpose.toLowerCase().includes(query) ||
      reservation.laboratory.toLowerCase().includes(query) ||
      reservation.pcno.toLowerCase().includes(query)
    )
  })
  
  // Methods
  function formatTime(dateString : string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  </script>
  <style>
  /* Add this style for smoother hover card appearance */
 
  </style>