<template>
  <div class="max-h-screen bg-[#1a1a1a] text-foreground p-4 md:p-8">
    <!-- <header class="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold">Welcome, {{ student.name }}!</h1>
        <p class="text-muted-foreground">Here's your sit-in dashboard overview.</p>
      </div>
      <Button size="lg" @click="reserveSitIn">
        <CalendarPlus class="mr-2 h-5 w-5" />
        Reserve a Sit-in
      </Button>
    </header> -->

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column -->
      <div class="flex flex-col gap-6">
        <!-- Sessions Remaining Card -->
        <Card class="bg-[#212121]">
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Sessions Remaining</CardTitle>
            <Users class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ student.sessions }} / {{ 30 }}</div>
            <Progress :model-value="sessionProgress" class="mt-2 h-3" />
            <p class="text-xs text-muted-foreground mt-1">
              {{ 30 - Number(student.sessions) }} sessions used
            </p>
          </CardContent>
        </Card>

        <!-- Total Points Card -->
        <Card class="bg-[#212121]">
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Total Points</CardTitle>
            <Star class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ points }}</div>
            <p class="text-xs text-muted-foreground">
              Earned from successful sit-ins
            </p>
          </CardContent>
        </Card>

        <!-- Announcements Card -->
        <Card class="bg-[#212121]">
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>Latest updates from the admin.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea class="h-[350px] pr-4">
              <div v-if="announcements.length > 0" class="space-y-4">
                <div v-for="announcement in announcements.slice(0,5)" :key="announcement.announcement_id" class="p-3 border rounded-md bg-[#2a2a2a]">
                  <h4 class="font-semibold text-sm mb-1">CCS Admin</h4>
                  <p class="text-xs text-muted-foreground leading-relaxed">{{ announcement.announcement_message.substring(0,100) }}{{ announcement.announcement_message.length > 100 ? '...' : '' }}</p>
                  <p class="text-xs text-muted-foreground mt-2">{{ formatDate(announcement.announcement_date, true) }}</p>
                </div>
              </div>
              <div v-else class="text-center py-6">
                <MegaphoneOff class="mx-auto h-12 w-12 text-muted-foreground" />
                <p class="mt-2 text-muted-foreground">No new announcements.</p>
              </div>
            </ScrollArea>
            <Button v-if="announcements.length > 5" variant="outline" class="w-full mt-4" @click="viewAllAnnouncements">View All Announcements</Button>
          </CardContent>
        </Card>
      </div>

      <!-- Right Column -->
      <div class="flex flex-col gap-6 col-span-2">
        <!-- Sit-in Activity Chart Card -->
        <Card class="bg-[#212121] flex flex-col flex-grow">
          <CardHeader>
            <CardTitle>Sit-in Activity</CardTitle>
            <CardDescription>Your sit-in count over the last 4 weeks.</CardDescription>
          </CardHeader>
          <CardContent class="md:h-[350px] flex-grow flex">
            <div class="relative w-full h-full">
              <Bar v-if="chartData.labels?.length" :data="chartData" :options="chartOptions" />
              <div v-else class="flex items-center justify-center h-full">
                <p class="text-muted-foreground">Not enough data for chart.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Recent Sit-in History Card -->
        <Card class="bg-[#212121]">
          <CardHeader>
            <CardTitle>Recent Sit-in History</CardTitle>
            <CardDescription>Your last few sit-in sessions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table v-if="sitInHistory.length > 0">
              <TableHeader>
                <TableRow>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Laboratory</TableHead>
                  <TableHead>Time In</TableHead>
                  <TableHead>Time Out</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="entry in sitInHistory.slice(0, 5)" :key="entry.id">
                  <TableCell class="max-w-[150px] truncate" :title="entry.purpose">{{ entry.purpose }}</TableCell>
                  <TableCell>{{ entry.laboratory }}</TableCell>
                  <TableCell>{{ formatDate(entry.timeIn, true) }}</TableCell>
                  <TableCell >
                      {{ entry.timeOut ? formatDate(entry.timeOut, true) : 'Ongoing' }}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div v-else class="text-center py-6">
              <History class="mx-auto h-12 w-12 text-muted-foreground" />
              <p class="mt-2 text-muted-foreground">No sit-in history yet.</p>
            </div>
            <Button variant="outline" class="w-full mt-4" @click="viewFullHistory">View Full History</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeMount, watch } from 'vue'; // watch is needed
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
// Badge is not used in this specific table version, can be removed if not used elsewhere
// import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Star, CalendarPlus, MegaphoneOff, History } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { useStudentStore } from '@/stores/student.store';
import { getStudentPoints } from '@/api/student';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, type ChartOptions, type ChartData } from 'chart.js';
import { getAnnouncements } from '@/api/announcement';
import type { Announcement } from '@/types/Announcement';
import { getSitinsByStudent } from '@/api/sitin';
import type { SitinByStudent } from '@/types/Sitin';
import { errorToast } from '@/library/toast';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const { student } = useStudentStore();
const router = useRouter();

const announcements = ref<Announcement[]>([]);
const points = ref<string>();

interface DashboardSitInHistoryEntry {
  id: string;
  purpose: string;
  laboratory: string;
  timeIn: string;
  timeOut: string | null;
}

const sitInHistory = ref<DashboardSitInHistoryEntry[]>([]);

// --- Helper function to get week start (Monday) and end (Sunday) ---
function getWeekRange(dateRef: Date, weekOffset: number = 0): { start: Date, end: Date } {
  const date = new Date(dateRef);
  date.setDate(date.getDate() + (weekOffset * 7));

  const dayOfWeek = date.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const startDate = new Date(date);
  startDate.setDate(date.getDate() + diffToMonday);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);

  return { start: startDate, end: endDate };
}


const loadDashboardData = async () => {
  try {
    const pointsResponse = await getStudentPoints(student.idno);
    points.value = pointsResponse.points;

    const announceResponse = await getAnnouncements();
    announcements.value = announceResponse.announcements;

    if (student && student.idno) {
      const sitinsResponse = await getSitinsByStudent(student.idno);
      const sortedSitins = sitinsResponse.sitins.sort((a: { sitin_timein: string | number | Date; }, b: { sitin_timein: string | number | Date; }) => new Date(b.sitin_timein).getTime() - new Date(a.sitin_timein).getTime());

      sitInHistory.value = sortedSitins.map((sitin: SitinByStudent) => ({
        id: sitin.sitin_id,
        purpose: sitin.sitin_purpose,
        laboratory: sitin.sitin_laboratory,
        timeIn: sitin.sitin_timein,
        timeOut: sitin.sitin_timeout,
      }));
    } else {
      console.warn("Student ID not available for fetching sit-in history.");
      sitInHistory.value = [];
    }
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
    errorToast("Could not load some dashboard data. Please try refreshing.");
  }
};

onBeforeMount(async () => {
  if (student && student.idno) {
    await loadDashboardData();
    // After data is loaded, generate chart data
    // This ensures sitInHistory is populated before chart generation attempt
    generateSitInActivityChartData();
  } else {
    errorToast("Student information not available. Dashboard may not load correctly.");
    console.error("Student ID not available on mount.");
    generateSitInActivityChartData(); // Generate with empty data if no student
  }
});

const sessionProgress = computed(() => (Number(student.sessions) / 30) * 100);

const chartData = ref<ChartData<'bar'>>({
  labels: [],
  datasets: [{
    label: 'Completed Sit-ins', // Updated label
    backgroundColor: '#00BD7E',
    borderColor: '#00BD7E',
    borderWidth: 1,
    borderRadius: 4,
    data: [],
  }]
});

const chartOptions = ref<ChartOptions<'bar'>>({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        color: '#FFFFFF',
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      }
    },
    x: {
      ticks: {
        color: '#FFFFFF',
      },
      grid: {
        display: false,
      }
    }
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#212121',
      titleColor: '#FFFFFF',
      bodyColor: '#FFFFFF',
      borderColor: 'hsl(var(--border))',
      borderWidth: 1,
    }
  }
});

// Renamed generateChartData to be more specific
const generateSitInActivityChartData = () => {
  if (!sitInHistory.value || sitInHistory.value.length === 0) {
    chartData.value = { labels: ['Week -3', 'Week -2', 'Last Week', 'This Week'], datasets: [{ ...chartData.value.datasets[0], data: [0,0,0,0] }] };
    return;
  }

  const today = new Date();
  const weeklyCounts = [0, 0, 0, 0]; // Index 0: Week -3, ..., 3: This Week

  const weekRanges = [
    getWeekRange(today, -3),
    getWeekRange(today, -2),
    getWeekRange(today, -1),
    getWeekRange(today, 0),
  ];

  // Filter for completed sit-ins (those with a timeOut)
  const completedSitIns = sitInHistory.value.filter(s => s.timeOut !== null);

  for (const sitin of completedSitIns) {
    if (!sitin.timeOut) continue; // Should be redundant due to filter, but good practice
    const sitInCompletionDate = new Date(sitin.timeOut); // Use timeOut to determine week of completion

    for (let i = 0; i < weekRanges.length; i++) {
      if (sitInCompletionDate >= weekRanges[i].start && sitInCompletionDate <= weekRanges[i].end) {
        weeklyCounts[i]++;
        break;
      }
    }
  }

  chartData.value = {
    labels: ['Week -3', 'Week -2', 'Last Week', 'This Week'],
    datasets: [{
      ...chartData.value.datasets[0],
      data: weeklyCounts,
    }]
  };
};

// `onMounted` is primarily for DOM interactions or things that need the DOM to be ready.
// Since chart generation depends on data, it's better handled after data load or via watcher.
// We already call generateSitInActivityChartData in onBeforeMount after loadDashboardData completes.

// Watch for changes in sitInHistory to regenerate chart if data is updated later
watch(sitInHistory, () => {
    generateSitInActivityChartData();
}, { deep: true });


const reserveSitIn = () => {
  router.push("/reservation")
};

const viewFullHistory = () => {
  router.push("/history")
};

const viewAllAnnouncements = () => {
  router.push("/announcement")
};

const formatDate = (dateString: string | null, includeTime = false) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';

  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  return date.toLocaleDateString(undefined, options);
};
</script>
<style scoped>
/* Chart.js needs a sized container to render properly.
   The `relative w-full h-full` on the chart's wrapper div and
   `responsive: true, maintainAspectRatio: false` in chart options handle this. */
</style>