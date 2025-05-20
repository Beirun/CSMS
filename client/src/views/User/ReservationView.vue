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
                  <th scope="col" class="pl-6 md:pl-20 px-6 py-3 text-left text-md font-medium text-gray-300 uppercase tracking-wider">
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
                    Lab {{ reservation.labno }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-md">
                    {{ reservation.pcno }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-md">
                    {{ formatDate(reservation.timein.slice(0,10)) }} {{ reservation.timein.slice(11) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-md" 
                    :class="{
                      'text-yellow-500/70': reservation.status === 'Pending',
                      'text-red-500/70': reservation.status === 'Disapproved',
                      'text-green-500/70': reservation.status === 'Approved'
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
            <p class="mt-1 text-md text-gray-400">Try adjusting your search query or add a new reservation.</p>
          </div>
        </div>

        <!-- Add Reservation Dialog -->
        <Dialog v-model:open="isDialogOpen">
          <DialogContent class="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-[#252525] border-[#333]">
            <DialogHeader>
              <DialogTitle class="text-gray-200">New Reservation</DialogTitle>
              <DialogDescription class="text-gray-400">
                Fill in the details for the new reservation.
              </DialogDescription>
            </DialogHeader>
            
            <div class="grid gap-4 py-4">
              <!-- Student Info (readonly) -->
              <div class="space-y-4 pb-4 border-b border-[#333]">
                <div class="flex justify-between items-center w-full">
                  <Label class="text-gray-300 w-[45%]">ID No:</Label>
                  <span class="text-gray-200 font-medium w-[45%] text-right">{{ student.idno }}</span>
                </div>
                <div class="flex justify-between items-center w-full">
                  <Label class="text-gray-300 w-[45%]">Student Name:</Label>
                  <span class="text-gray-200 font-medium w-[45%] text-right">{{ student.firstname }} {{ student.middlename }} {{ student.lastname }}</span>
                </div>
                <div class="flex justify-between items-center w-full">
                  <Label class="text-gray-300 w-[45%]">Remaining Sessions:</Label>
                  <span class="text-gray-200 font-medium w-[45%] text-right">{{ student.sessions }}</span>
                </div>
              </div>

              <!-- Purpose and Laboratory in same line -->
              <div class="flex flex-col sm:flex-row justify-between w-full gap-4 py-2">
                <!-- Purpose Dropdown -->
                <div class="w-full sm:w-[48%]">
                  <Label for="purpose" class="text-gray-300 pb-2 block">Purpose</Label>
                  <Select v-model="newReservation.purpose">
                    <SelectTrigger id="purpose" class="bg-[#333] cursor-pointer border-[#444] text-gray-200 w-full">
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent class="bg-[#333] border-[#444] text-gray-200">
                      <SelectGroup>
                        <SelectLabel>Purposes</SelectLabel>
                        <SelectItem 
                          v-for="purposeItem in purposes.slice(1)" 
                          :key="purposeItem" 
                          :value="purposeItem"
                          class="hover:bg-[#444] cursor-pointer"
                        >
                          {{ purposeItem }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <!-- Laboratory Dropdown with HoverCard for PCs -->
                <div class="w-full sm:w-[48%]">
                  <Label for="laboratory" class="text-gray-300 pb-2 block">Laboratory & PC</Label>
                  <Select v-model="newReservation.laboratory" :open="laboratoryDropdownOpen" @update:open="handleDropdownOpen">
                    <SelectTrigger id="laboratory" class="bg-[#333] cursor-pointer border-[#444] text-gray-200 w-full">
                      <SelectValue :placeholder="labph" />
                    </SelectTrigger>
                    <SelectContent class="bg-[#333] border-[#444] text-gray-200">
                      <SelectGroup>
                        <SelectLabel>Laboratories</SelectLabel>
                        <div v-for="lab in laboratories" :key="lab.name">
                          <HoverCard :open-delay="0" :close-delay="100">
                            <HoverCardTrigger as-child>
                              <div 
                                class="w-full px-2 py-1.5 text-sm hover:bg-[#444] cursor-default transition-colors duration-100 rounded-sm"
                              >
                                <span>{{ lab.name }}</span>
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent 
                              class="w-auto p-2 bg-[#2e2e2e] border-[#444] text-gray-200 transition-opacity duration-100 shadow-lg"
                              side="right"
                              align="start"
                            >
                              <p v-if="lab.pcs.length === 0" class="text-xs text-gray-400 p-2">No PCs available</p>
                              <div v-else class="grid grid-cols-3 gap-2">
                                <Button
                                  v-for="pcItem in lab.pcs"
                                  :key="pcItem"
                                  variant="ghost"
                                  class="h-8 w-12 p-0 text-xs hover:bg-[#444] transition-colors duration-100 text-gray-200"
                                  @click="selectPC(lab.name, pcItem)"
                                >
                                  {{ pcItem }}
                                </Button>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </div>
                         <div v-if="laboratories.length === 0" class="px-2 py-1.5 text-sm text-gray-400">
                            No laboratories available.
                        </div>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <div class="mt-2 text-sm text-gray-300 h-5">
                    <div v-if="newReservation.pcno">
                      <i class="pi pi-desktop text-md pr-2"></i><span class="font-medium">Selected: PC {{ newReservation.pcno }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Date and Time in same line -->
              <div class="flex flex-col sm:flex-row justify-between w-full gap-4">
                <!-- Date Picker -->
                <div class="w-full sm:w-[48%]">
                  <Label for="date" class="text-gray-300 pb-2 block">Date</Label>
                  <Popover v-model:open="isDatePopoverOpen"> 
                    <PopoverTrigger as-child>
                      <Button
                        id="date"
                        class="hover:bg-transparent w-full justify-start text-left font-normal bg-transparent border border-[#444444] text-gray-200"
                        :class="{ 'text-gray-400': !newReservation.date }"
                      >
                        <CalendarIcon class="mr-2 h-4 w-4" />
                        <span>{{ newReservation.date ? formatDate(newReservation.date.toString()) : 'Pick a date' }}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0 bg-[#2e2e2e] border-[#444] text-gray-200">
                      <Calendar
                        :v-model="newReservation.date"          
                        @update:model-value="handleDateUpdateAndClose" 
                        mode="single"
                        :min-value="minSelectableDate as CalendarDate"             
                        initial-focus
                        class="text-gray-200 custom-calendar-styles" 
                        weekday-format="short"                   
                      />
                    </PopoverContent>
                  </Popover>
                </div>

<div class="w-full sm:w-[48%]">
                  <Label 
                    for="time" 
                    class="text-gray-300 pb-2 block" 
                    :class="{ 'text-gray-500': !newReservation.date || !newReservation.laboratory }"
                  >
                    Time
                  </Label>
                  <Select 
                    v-model="newReservation.time" 
                    :disabled="!newReservation.date || !newReservation.laboratory "
                  > 
                    <SelectTrigger 
                      id="time" 
                      class="cursor-pointer bg-[#333] border-[#444] hover:bg-[#404040] text-gray-200 w-full"
                      :class="{ 'cursor-not-allowed opacity-50': !newReservation.date || !newReservation.laboratory }" 
                    >
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent class="bg-[#333] border-[#444] text-gray-200">
                      <SelectGroup>
                        <SelectLabel v-if="!newReservation.date || !newReservation.laboratory || !newReservation.pcno">
                          Select Date, Lab & PC first
                        </SelectLabel>
                        <SelectLabel v-else-if="isLoadingLabSchedule">Loading schedule...</SelectLabel>
                        <SelectLabel v-else-if="availableTimeSlotsForSelect.length === 0 && newReservation.date && newReservation.laboratory && newReservation.pcno">
                            No available times found.
                        </SelectLabel>
                        <SelectLabel v-else-if="availableTimeSlotsForSelect.length > 0">Available Times</SelectLabel>
                        <SelectLabel v-else>Select prerequisites</SelectLabel>
                        
                        <SelectItem 
                          v-for="timeSlotItem in availableTimeSlotsForSelect" 
                          :key="timeSlotItem" 
                          :value="timeSlotItem"
                          class="hover:bg-[#444] cursor-pointer"
                        >
                          {{ timeSlotItem }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter class="pt-4">
              <Button variant="outline" @click="closeDialog" class="border-[#444] text-gray-200 hover:bg-[#444]">
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
import { ref, computed, onBeforeMount, watch } from 'vue'
// import NavbarDashboard from '@/components/StudentSidebar.vue' // Assuming this is for a layout, not directly used here
import { PlusIcon, CalendarIcon } from 'lucide-vue-next' // Removed ChevronRightIcon if not used
import { purposes as purposesList } from '@/library/list' // Renamed to avoid conflict
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
// import { Input } from '@/components/ui/input' // Not explicitly used in the search, can be removed if input is native
import { Label } from '@/components/ui/label'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { 
  CalendarDate, 
  today as getToday, 
  getLocalTimeZone, 
  type DateValue 
} from '@internationalized/date';
import { getLabSchedule } from '@/api/labschedule'


import type { PC } from '@/types/PC'; // Define this type or import
import { getAvailablePCs } from '@/api/pc' // Your API function
import { useStudentStore } from '@/stores/student.store' // Your Pinia store
import { addReservation, getReservationsByStudent } from '@/api/reservation' // Your API functions
import { successToast, errorToast } from '@/library/toast' // Your toast library
import type { Reservation } from '@/types/Reservation' // Define this type or import
import { postNotification } from '@/api/notification'
// --- Student Data ---
const { student } = useStudentStore()

// --- Dialog and Form State ---
const isDialogOpen = ref(false)
const labph = ref("Select laboratory")

const initialNewReservationState = () => ({
  idno : student.idno,
  purpose: '',
  laboratory: '',
  pcno: '',
  date: undefined as DateValue | undefined,
  time: '',
  status: 'Pending',
  stringDate: ''
})
const newReservation = ref(initialNewReservationState())

// --- Date Picker State ---
const isDatePopoverOpen = ref(false);
const minSelectableDate = ref<CalendarDate>(getToday(getLocalTimeZone())); 

const handleDateUpdateAndClose = (selectedDate: DateValue | undefined) => {
  newReservation.value.date = selectedDate;
  if (selectedDate) {
    isDatePopoverOpen.value = false;
  }
};

// --- Data for Selects ---
interface Laboratory {
  name: string;
  pcs: string[]; 
}
const pcs = ref<PC[]>([])
const laboratories = ref<Laboratory[]>([])
const purposes = ref<string[]>(purposesList || []) // Handle if purposesList is undefined


function groupPcsByLab(pcsData: PC[]): Laboratory[] {
  if (!pcsData) return [];
  const labsMap: Record<string, string[]> = {};
  pcsData.forEach((pc: PC) => {
    if (!labsMap[pc.labno]) {
      labsMap[pc.labno] = [];
    }
    labsMap[pc.labno].push(pc.pcno.padStart(2, '0')); 
  });
  return Object.entries(labsMap)
    .map(([labno, pcNumbers]) => ({
      name: `Lab ${labno}`,
      pcs: pcNumbers.sort((a,b) => parseInt(a) - parseInt(b)) // Sort PCs numerically
    }))
    .sort((a,b) => parseInt(a.name.substring(4)) - parseInt(b.name.substring(4))); // Sort Labs numerically
}

const timeSlots = Array.from({ length: 19 }, (_, i) => { // 8 AM to 5 PM (inclusive for start times)
  const hour = 8 + Math.floor(i / 2);
  const minute = (i % 2) === 0 ? '00' : '30';
  if (hour === 17 && minute === '30') return null; // No 5:30 PM slot
  const period = hour >= 12 ? (hour === 12 && minute === '00' ? 'NN' : 'PM') : 'AM'; // Noon as NN
  let displayHour = hour;
  if (hour === 0) displayHour = 12; // Midnight case, though not in 8-5 range
  else if (hour > 12) displayHour = hour - 12;
  
  return `${String(displayHour).padStart(2, '0')}:${minute} ${period}`;
}).filter(Boolean) as string[];


// --- Laboratory & PC Selection ---
const laboratoryDropdownOpen = ref(false)

function selectPC(labName : string, pc :string) {
  newReservation.value.laboratory = labName
  newReservation.value.pcno = pc
  laboratoryDropdownOpen.value = false // Close outer select
  labph.value = `${labName} - PC ${pc}` // Update placeholder to show selection
}

function handleDropdownOpen(open : boolean) {
  // This logic is tricky with HoverCard inside. 
  // The HoverCard might steal focus or close events.
  // For simplicity, let the Select component handle its open/close mostly.
  // We only force it closed if a PC is selected via selectPC.
  laboratoryDropdownOpen.value = open
}
  
// --- Utility Functions ---
function formatDate(dateString?: string) {
  if (!dateString) return 'N/A';
  try {
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return 'Invalid Date'; // Check if date is valid
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return "Invalid Date";
  }
}
  
// --- API Interactions & Form Submission ---
async function submitReservation() {
  // Basic Validation
  if (!newReservation.value.purpose) { errorToast("Purpose is required."); return; }
  if (!newReservation.value.laboratory || !newReservation.value.pcno) { errorToast("Laboratory and PC Number are required."); return; }
  if (!newReservation.value.date) { errorToast("Date is required."); return; }
  if (!newReservation.value.time) { errorToast("Time is required."); return; }
  
  if (Number(student.sessions) <= 0) {
    errorToast("You have no remaining sessions to make a reservation.");
    return;
  }

  const labNumber = newReservation.value.laboratory.startsWith("Lab ") 
                    ? newReservation.value.laboratory.split(' ')[1] 
                    : newReservation.value.laboratory;

  const submissionData = {
    ...newReservation.value,
    laboratory: labNumber,
    stringDate: newReservation.value.date.toString(), // YYYY-MM-DD format
    timein: `${newReservation.value.date.toString()} ${newReservation.value.time}` // Combine date and time for backend if needed
  };

  try {
    const response = await addReservation(submissionData);
    if (response.success) {
      //post notification
      await postNotification("0","New Student Reservation","A student has submitted a new reservation","alert")
      successToast('Reservation added successfully');
      fetchReservations(); // Refresh the list
      fetchAvailablePCs(); // Refresh PC list (in case availability changed)
      closeDialog();
    } else {
      errorToast(response.message || 'Failed to add reservation.');
    }
  } catch (err) {
    console.error("Error submitting reservation:", err);
    errorToast('An error occurred while submitting the reservation.');
  }
}

function closeDialog() {
  isDialogOpen.value = false;
  newReservation.value = initialNewReservationState(); // Reset form
  labph.value = "Select laboratory"; // Reset placeholder
}

// --- Data Fetching ---
const reservations = ref<Reservation[]>([])
const isLoadingReservations = ref(false);

async function fetchReservations() {
  isLoadingReservations.value = true;
  try {
    const response = await getReservationsByStudent(student.idno);
    if (response && response.reservation) {
      reservations.value = response.reservation.sort((a: { timein: string | number | Date }, b: { timein: string | number | Date }) => new Date(b.timein).getTime() - new Date(a.timein).getTime()); // Sort by newest first
    } else {
      reservations.value = [];
    }
  } catch (error) {
    console.error("Failed to fetch reservations:", error);
    errorToast("Could not load reservations.");
    reservations.value = [];
  } finally {
    isLoadingReservations.value = false;
  }
}

async function fetchAvailablePCs() {
  try {
    const pcResponse = await getAvailablePCs();
    if (pcResponse && pcResponse.pcs) {
      pcs.value = pcResponse.pcs;
      laboratories.value = groupPcsByLab(pcResponse.pcs);
    } else {
      pcs.value = [];
      laboratories.value = [];
    }
  } catch (error) {
    console.error("Failed to fetch PCs:", error);
    // errorToast("Could not load available PCs."); // Optional: can be noisy
    pcs.value = [];
    laboratories.value = [];
  }
}

// --- Search & Filter ---
const searchQuery = ref('')
const filteredReservations = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return reservations.value;
  
  return reservations.value.filter(reservation => 
    reservation.purpose.toLowerCase().includes(query) ||
    `lab ${reservation.labno}`.toLowerCase().includes(query) || // Search "Lab X"
    reservation.pcno.toLowerCase().includes(query) ||
    reservation.status.toLowerCase().includes(query) ||
    formatDate(reservation.timein.slice(0,10)).toLowerCase().includes(query)
  );
})

type LabSchedule = {
  id: number,
  lab_number: string,
  days: string,
  time: string,
  status: string
}
type TransformedLabSchedule = {
  [dayGroup: string]: { // e.g., 'monWed', 'tuesThurs'
    [time: string]: string; // e.g., '7:30': 'Closed'
  };
}

const labSchedules = ref<LabSchedule[]>([])

function transformScheduleData(scheduleArray: LabSchedule[]): TransformedLabSchedule {
  const transformedSchedule: TransformedLabSchedule = {};

  scheduleArray.forEach(item => {
    let dayGroupKey = item.days; // Using the 'days' field directly as the key

    // You can add mapping here if you want different keys, e.g.:
    // if (item.days === 'monWed') dayGroupKey = 'Monday & Wednesday';
    // else if (item.days === 'tuesThurs') dayGroupKey = 'Tuesday & Thursday';
    // ... and so on

    const startTime = item.time.split('-')[0];

    if (!transformedSchedule[dayGroupKey]) {
      transformedSchedule[dayGroupKey] = {};
    }
    transformedSchedule[dayGroupKey][startTime] = item.status;
  });

  return transformedSchedule;
}


const formattedLabSchedule = computed<TransformedLabSchedule>(() => {
  if (labSchedules.value.length === 0) {
    return {}; // Return an empty object if there's no data
  }
  return transformScheduleData(labSchedules.value);
});

console.log("fls",formattedLabSchedule.value)
// --- Lifecycle Hooks ---
onBeforeMount(async () => {
  await fetchReservations();
  await fetchAvailablePCs();
  const response = await getLabSchedule("517");
  // labSchedules.value 
  // console.log(response.lab_sched)
  labSchedules.value = response.lab_sched

});

// Watch for dialog open to potentially re-fetch PCs if needed
watch(isDialogOpen, (newValue) => {
  if (newValue) {
    // Potentially refresh available PCs when dialog opens,
    // if PC availability can change frequently.
    // fetchAvailablePCs(); 
    
    // Reset form state when dialog opens (if not closed properly before)
    if(JSON.stringify(newReservation.value) !== JSON.stringify(initialNewReservationState())) {
        newReservation.value = initialNewReservationState();
        labph.value = "Select laboratory";
    }
  }
});

watch(() => newReservation.value.laboratory, async (newLabFullName) => {
  if (newLabFullName && newLabFullName.startsWith("Lab ")) {
    const labNum = newLabFullName.split(' ')[1];
    const response = await getLabSchedule(labNum);
    labSchedules.value = response.lab_sched
    console.log("lab",formattedLabSchedule.value)
  }
}, { immediate: false });


const availableTimeSlotsForSelect = ref<string[]>([]);
const isLoadingLabSchedule = ref(false);

// Helper to convert 24-hour "H:MM" or "HH:MM" to 12-hour "HH:MM AM/PM/NN"
function formatTime24to12(time24: string): string {
  const [hoursStr, minutesStr] = time24.split(':');
  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  const period = hours >= 12 ? (hours === 12 && minutes === 0 ? 'NN' : 'PM') : 'AM';
  if (hours === 0) { 
    hours = 12;
  } else if (hours > 12) {
    hours -= 12;
  }
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
}

watch(() => newReservation.value.date, async (date) => {
  const dayKeyPriority: { [key: number]: string[] } = {
  0: ['sun', 'daily'], 
  1: ['mon', 'monWed', 'daily'], 
  2: ['tues', 'tuesThurs', 'daily'],
  3: ['wed', 'monWed', 'daily'], 
  4: ['thurs', 'tuesThurs', 'daily'],
  5: ['fri', 'daily'], 
  6: ['sat', 'daily'], 
};
  //if date is monday or wednesday, set timeSlots to array of monwed
    const dayOfWeek  = date?.toDate(getLocalTimeZone()).getDay();
  console.log(dayOfWeek)
    let effectiveDayGroupKey: string | null = null;
  const potentialKeys = dayKeyPriority[dayOfWeek as number] || [];

  for (const key of potentialKeys) {
    if (formattedLabSchedule.value && formattedLabSchedule.value[key]) {
      effectiveDayGroupKey = key;
      break;
    }
  }
      console.log("pot",potentialKeys)
      console.log("eff", effectiveDayGroupKey)
  //if date is tuesday or thursday, set timeSlots to array of tuesthurs
  const scheduleForDay = formattedLabSchedule.value[effectiveDayGroupKey as string];
const openSlots24h = Object.entries(scheduleForDay)
    .filter(([_, status]) => status === 'Open')
    .map(([time24, _]) => time24);

  openSlots24h.sort((a, b) => {
    const [hA, mA] = a.split(':').map(Number);
    const [hB, mB] = b.split(':').map(Number);
    if (hA !== hB) return hA - hB;
    return mA - mB;
  });
  

  availableTimeSlotsForSelect.value = openSlots24h;

  //if date is friday, set timeSlots to array of fri
  
  
  //if date is saturday, set timeSlots to array of sat

}, { immediate: false });
</script>

<style>
/* Custom Calendar Styles for Dark Mode (if needed) */
.custom-calendar-styles {
  /* Example: Ensure text is visible */
  --vc-clr-primary: #00BD7E; /* Accent color */
  --vc-clr-secondary: #a0aec0; /* Text color for days */
  --vc-bg-primary: #2e2e2e; /* Background */
  --vc-bg-secondary-hover: #3f3f3f;
  --vc-border-primary: #444444;
}

</style>