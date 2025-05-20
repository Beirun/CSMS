// DashboardView.vue
<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue';
import { getAnnouncements } from '@/api/announcement';
import { getSitins } from '@/api/sitin';
import { getSitinFeedbacks } from '@/api/feedback';
import type { Announcement } from '@/types/Announcement';
import type { Sitin } from '@/types/Sitin';
import type { StudentSitinFeedback } from '@/types/Feedback';
import { setDate } from '@/library/date';
import { Bar, Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement);

// --- COLOR DEFINITIONS FOR CHARTS ---
const darkerGreenPrimary = '#00A06B';
const darkerGreenShade1 = '#008F5F';
// --- END COLOR DEFINITIONS ---

// --- State for fetched data ---
const announcements = ref<Announcement[]>([]);
const sitins = ref<Sitin[]>([]);
const studentFeedbacks = ref<StudentSitinFeedback[]>([]);
const dataLoaded = ref(false);

// --- CHART DATA DEFINITIONS ---
const lineChartTitle = 'Monthly Activity Trend';
const lineChartData = ref({
  labels: ['January', 'February', 'March', 'April', 'May'],
  datasets: [
    {
      borderColor: darkerGreenPrimary,
      data: [65, 59, 80, 81, 56],
      fill: false,
      tension: 0.1
    }
  ]
});

const mockBarChartTitle = 'User Engagement by Feature';
const mockBarChartData = ref({
  labels: ['Feature A', 'Feature B', 'Feature C', 'Feature D', 'Feature E'],
  datasets: [
    {
      backgroundColor: darkerGreenShade1,
      data: [25, 30, 15, 40, 20]
    }
  ]
});

const sitinByLabTitle = 'Sit-ins per Laboratory';
const sitinByLabChartData = computed(() => {
  if (!dataLoaded.value || sitins.value.length === 0) {
    return {
      labels: [],
      datasets: [{
        backgroundColor: darkerGreenPrimary,
        data: []
      }]
    };
  }

  const labCounts: { [key: string]: number } = {};
  sitins.value.forEach(sitin => {
    const labKey = String(sitin.sitin_laboratory || 'Unknown');
    labCounts[labKey] = (labCounts[labKey] || 0) + 1;
  });

  return {
    labels: Object.keys(labCounts).map(lab => lab === 'Unknown' ? 'Unknown Lab' : `Lab ${lab}`),
    datasets: [
      {
        backgroundColor: darkerGreenPrimary,
        data: Object.values(labCounts)
      }
    ]
  };
});

// --- Computed Property for Recent Feedbacks ---
const recentFeedbacks = computed(() => {
  const sortedFeedbacks = [...studentFeedbacks.value].sort((a, b) => {
    const dateA = a.sitin_timein ? new Date(a.sitin_timein).getTime() : 0;
    const dateB = b.sitin_timein ? new Date(b.sitin_timein).getTime() : 0;
    return dateB - dateA;
  });
  return sortedFeedbacks.slice(0, 4);
});

// --- Helper function to create chart options with a specific title ---
const createChartOptions = (titleText: string) => {
  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
          display: true,
          text: titleText,
          color: '#FFFFFF',
          font: {
              size: 16,
              weight: 'bold' as 'bold'
          },
          padding: {
              top: 5,
              bottom: 15
          }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#FFFFFF'
        },
        grid: {
          color: '#4A4A4A'
        }
      },
      y: {
        ticks: {
          color: '#FFFFFF'
        },
        grid: {
          color: '#4A4A4A'
        }
      }
    }
  };
  return options;
};

// --- Specific options for each chart ---
const sitinByLabChartOptions = computed(() => createChartOptions(sitinByLabTitle));
const lineChartOptions = computed(() => createChartOptions(lineChartTitle));
const mockBarChartOptions = computed(() => createChartOptions(mockBarChartTitle));


onBeforeMount(async () => {
  try {
    const [announcementsResponse, sitinsResponse, feedbacksResponse] = await Promise.all([
      getAnnouncements(),
      getSitins(),
      getSitinFeedbacks()
    ]);
    announcements.value = announcementsResponse.announcements || [];
    sitins.value = sitinsResponse.sitins || [];
    studentFeedbacks.value = feedbacksResponse.sitins || feedbacksResponse.feedbacks || [];
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
  } finally {
    dataLoaded.value = true;
  }
});

const formatFeedbackDate = (dateString: string) => {
    if (!dateString) return '';
    return setDate(dateString);
};

</script>

<template>
    <div class="flex flex-col items-center text-white pt-6 gap-6 px-10 w-[calc(100vw-var(--spacing)*64)] max-h-screen overflow-y-auto">
      <h1 class="text-4xl font-bold text-white mb-4 self-start">Admin Dashboard Overview</h1>

      <div class="flex items-stretch justify-center w-full gap-10">
        <!-- Modernized Recent Student Feedback Section -->
        <div class="flex flex-col w-1/4 min-h-[300px] bg-[#2e2e2e] rounded-lg p-4 overflow-hidden">
            <h2 class="text-lg font-semibold text-white mb-3 text-center flex-shrink-0">Recent Student Feedback</h2>
            <div class="overflow-y-auto flex-grow pr-1">
                <div v-if="dataLoaded && recentFeedbacks.length > 0">
                    <ul class="space-y-3">
                        <li v-for="feedback in recentFeedbacks" :key="feedback.sitin_id"
                            class="bg-[#3a3a3a] p-3 rounded-md shadow-sm transition-all hover:bg-[#444444]">
                            <blockquote class="mb-1.5">
                                <p class="text-gray-100 text-sm italic leading-relaxed">
                                    “{{ feedback.sitin_feedback }}”
                                </p>
                            </blockquote>
                            <figcaption class="text-xs text-gray-400 text-right">
                                — {{ feedback.fullname || `ID: ${feedback.idno}` }}
                                <span v-if="feedback.sitin_timein" class="text-gray-500 ml-1"> | {{ formatFeedbackDate(feedback.sitin_timein) }}</span>
                            </figcaption>
                        </li>
                    </ul>
                </div>
                <div v-else-if="dataLoaded && studentFeedbacks.length === 0" class="flex items-center justify-center h-full text-gray-400">
                    No recent feedback.
                </div>
                <div v-else class="flex items-center justify-center h-full text-gray-400">Loading Feedback...</div>
            </div>
        </div>

        <div class="flex flex-col w-3/4 min-h-[300px] bg-[#2e2e2e] rounded-lg p-4">
          <Bar v-if="dataLoaded" :data="sitinByLabChartData" :options="sitinByLabChartOptions" />
          <div v-else class="flex items-center justify-center w-full h-full">Loading Sit-in Data...</div>
        </div>
      </div>

      <div class="flex items-stretch justify-center w-full gap-10 pb-10">
        <div class="flex flex-col w-2/3 min-h-[300px] bg-[#2e2e2e] rounded-lg p-4">
          <Line v-if="dataLoaded" :data="lineChartData" :options="lineChartOptions" />
          <div v-else class="flex items-center justify-center w-full h-full">Loading...</div>
        </div>
        <div class="flex flex-col w-1/3 min-h-[300px] bg-[#2e2e2e] rounded-lg p-4">
          <Bar v-if="dataLoaded" :data="mockBarChartData" :options="mockBarChartOptions" />
          <div v-else class="flex items-center justify-center w-full h-full">Loading...</div>
        </div>
      </div>
    </div>
</template>

<style scoped>
/* Canvas styling reverted as per your request */
.flex canvas { /* Target canvas elements within the flex containers */
  width: 100% !important;
  height: 37.5vh !important; /* Allow height to adjust based on aspect ratio or container */
  max-height: calc(100% - 30px);
}

.min-h-\[300px\] { /* For chart card containers and loading states */
    min-height: 300px;
}

/* Custom scrollbar for feedback section (optional, webkit-based browsers) */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: #2e2e2e;
  border-radius: 3px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 3px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #777;
}
</style>