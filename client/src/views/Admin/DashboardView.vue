<script setup lang="ts">
import { onBeforeMount } from 'vue'; // Retained as per original
import { getAnnouncements } from '@/api/announcement'; // Retained
import { ref } from 'vue'
// import AdminNavbar from '@/components/AdminSidebar.vue'; // Assuming this is handled by layout
import type { Announcement } from '@/types/Announcement'; // Retained
import { setDate } from '@/library/date'; // Retained
import { Bar, Pie, Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, PointElement, LineElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, PointElement, LineElement)

// --- COLOR DEFINITIONS FOR CHARTS ---
const originalGreen = '#00BD7E'; // Your original primary
const darkerGreenPrimary = '#00A06B'; // Darker primary for main elements
const darkerGreenShade1 = '#008F5F'; // A slightly darker shade for variation
const darkerGreenShade2 = '#007A50'; // An even darker shade for variation
// --- END COLOR DEFINITIONS ---


const barChartData = ref({
  labels: ['January', 'February', 'March', 'April', 'May'],
  datasets: [
    {
      label: 'Bar Chart Data',
      backgroundColor: darkerGreenPrimary, // CHANGED to darker green
      data: [40, 20, 12, 39, 10]
    }
  ]
})

const pieChartData = ref({
  labels: ['Red', 'Blue', 'Yellow'], // Kept original labels as requested
  datasets: [
    {
      backgroundColor: [darkerGreenPrimary, darkerGreenShade1, darkerGreenShade2], // CHANGED with darker green shades
      data: [300, 50, 100]
    }
  ]
})

const lineChartData = ref({
  labels: ['January', 'February', 'March', 'April', 'May'],
  datasets: [
    {
      label: 'Line Chart Data',
      borderColor: darkerGreenPrimary, // CHANGED to darker green
      // If you had a fill color that was based on the original green, you'd change it here too.
      // For example, if it was: backgroundColor: `${originalGreen}33`,
      // you might change it to: backgroundColor: `${darkerGreenPrimary}33`,
      data: [65, 59, 80, 81, 56],
      fill: false,
      tension: 0.1
    }
  ]
})

// Retaining your original chartOptions
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false
  // Any other options you had here originally would be retained
})

// --- Retaining original script logic if any, e.g., onBeforeMount, etc. ---
// Example:
// const announcements = ref<Announcement[]>([])
// const loaded = ref(false)
// onBeforeMount(async () => {
//   const response = await getAnnouncements()
//   announcements.value = response.announcements;
//   loaded.value = true
// })
// --- End retained script logic ---

</script>

<template>
    <!-- Using your original template structure -->
    <div class=" flex flex-col items-center text-white pt-10 gap-10 px-10 w-[calc(100vw-var(--spacing)*64)] max-h-screenm">
      <div class="flex items-center justify-center w-full h-1/2 gap-10">
        <div class="flex w-3/4 h-[416px] bg-[#2e2e2e] rounded-lg p-4"> <!-- Changed h-96 to h-[416px] -->
          <Bar :data="barChartData" :options="chartOptions" />
        </div>
        <div class="flex w-1/4 h-[416px] bg-[#2e2e2e] rounded-lg justify-center p-4"> <!-- Changed h-96 to h-[416px] -->
            <Pie :data="pieChartData" :options="chartOptions" />
        </div>
      </div>
      <div class="flex items-center justify-center w-full h-1/2 gap-10">
        <div class="flex w-2/3 h-[416px] bg-[#2e2e2e] rounded-lg p-4"> <!-- Changed h-96 to h-[416px] -->
          <Line :data="lineChartData" :options="chartOptions" />
        </div>
        <div class="flex w-1/3 h-[416px] bg-[#2e2e2e] rounded-lg p-4"> <!-- Changed h-96 to h-[416px] -->
          <!-- Assuming you want this bar chart to also use the new darker green -->
          <Bar :data="barChartData" :options="chartOptions" />
        </div>
      </div>
      <div>
        <!-- Any other content you had here -->
      </div>
    </div>
</template>