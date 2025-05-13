<template>
  <div class="min-h-screen bg-[#1a1a1a] text-foreground p-4 md:p-8">
    <header class="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold">Welcome, {{ student.name }}!</h1>
        <p class="text-muted-foreground">Here's your sit-in dashboard overview.</p>
      </div>
      <Button size="lg" @click="reserveSitIn">
        <CalendarPlus class="mr-2 h-5 w-5" />
        Reserve a Sit-in
      </Button>
    </header>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <Card class="bg-[#212121]">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Sessions Remaining</CardTitle>
          <Users class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ student.sessionsRemaining }} / {{ student.maxSessions }}</div>
          <Progress :model-value="sessionProgress" class="mt-2 h-3" />
          <p class="text-xs text-muted-foreground mt-1">
            {{ student.maxSessions - student.sessionsRemaining }} sessions used
          </p>
        </CardContent>
      </Card>

      <Card class="bg-[#212121]">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Points</CardTitle>
          <Star class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ student.points }}</div>
          <p class="text-xs text-muted-foreground">
            Earned from successful sit-ins
          </p>
        </CardContent>
      </Card>

       <Card class="md:col-span-2 lg:col-span-1 bg-[#212121]">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Next Sit-in</CardTitle>
          <CalendarClock class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div v-if="nextSitIn" class="space-y-1">
            <p class="text-lg font-semibold">{{ nextSitIn.location }}</p>
            <p class="text-sm text-muted-foreground">
              {{ formatDate(nextSitIn.dateTime) }}
            </p>
            <p class="text-xs text-muted-foreground">Status: {{ nextSitIn.status }}</p>
          </div>
          <div v-else class="text-center py-4">
            <p class="text-muted-foreground">No upcoming sit-ins scheduled.</p>
            <Button variant="link" class="mt-2" @click="reserveSitIn">Schedule Now</Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Main Sections -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Announcements -->
      <Card class="lg:col-span-1 bg-[#212121]">
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
          <CardDescription>Latest updates from the admin.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea class="h-[350px] pr-4">
            <div v-if="announcements.length > 0" class="space-y-4">
              <div v-for="announcement in announcements.slice(0,5)" :key="announcement.id" class="p-3 border rounded-md bg-[#2a2a2a]">
                <h4 class="font-semibold text-sm mb-1">{{ announcement.title }}</h4>
                <p class="text-xs text-muted-foreground leading-relaxed">{{ announcement.content.substring(0,100) }}{{ announcement.content.length > 100 ? '...' : '' }}</p>
                <p class="text-xs text-muted-foreground mt-2">{{ formatDate(announcement.date, true) }}</p>
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

      <!-- Sit-in Activity Chart -->
      <Card class="lg:col-span-2 bg-[#212121]">
        <CardHeader>
          <CardTitle>Sit-in Activity</CardTitle>
          <CardDescription>Your sit-in count over the last 4 weeks.</CardDescription>
        </CardHeader>
        <CardContent class="h-[300px] md:h-[350px]">
          <Bar v-if="chartData.labels?.length" :data="chartData" :options="chartOptions" />
          <div v-else class="flex items-center justify-center h-full">
            <p class="text-muted-foreground">Not enough data for chart.</p>
          </div>
        </CardContent>
      </Card>

      <!-- Upcoming Sit-ins -->
      <Card class="lg:col-span-1 bg-[#212121]">
        <CardHeader>
          <CardTitle>Upcoming Sit-ins</CardTitle>
          <CardDescription>Your next few scheduled sessions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="upcomingSitIns.length > 0">
            <ul class="space-y-3">
              <li v-for="sitin in upcomingSitIns.slice(0, 3)" :key="sitin.id" class="flex items-center justify-between p-3 rounded-md border hover:bg-accent">
                <div>
                  <p class="font-medium">{{ sitin.location }}</p>
                  <p class="text-xs text-muted-foreground">{{ formatDate(sitin.dateTime) }}</p>
                </div>
                <Badge :variant="sitin.status === 'Confirmed' ? 'default' : 'secondary'">{{ sitin.status }}</Badge>
              </li>
            </ul>
            <Button v-if="upcomingSitIns.length > 3" variant="outline" class="w-full mt-4" @click="viewAllUpcoming">View All</Button>
          </div>
          <div v-else class="text-center py-6">
            <CalendarX2 class="mx-auto h-12 w-12 text-muted-foreground" />
            <p class="mt-2 text-muted-foreground">No upcoming sit-ins.</p>
          </div>
        </CardContent>
      </Card>

      <!-- Recent Sit-in History -->
      <Card class="lg:col-span-2 bg-[#212121]">
        <CardHeader>
          <CardTitle>Recent Sit-in History</CardTitle>
          <CardDescription>Your last few completed sit-ins.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table v-if="sitInHistory.length > 0">
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead class="text-right">Points Earned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="entry in sitInHistory.slice(0, 5)" :key="entry.id">
                <TableCell>{{ formatDate(entry.date) }}</TableCell>
                <TableCell>{{ entry.location }}</TableCell>
                <TableCell>{{ entry.duration }}</TableCell>
                <TableCell class="text-right">
                  <Badge :variant="entry.pointsEarned > 0 ? 'default' : 'outline'">
                    {{ entry.pointsEarned > 0 ? `+${entry.pointsEarned}` : '-' }}
                  </Badge>
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Star, CalendarPlus, CalendarClock, CalendarX2, MegaphoneOff, History } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
// Chart.js integration
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, type ChartOptions, type ChartData } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const router = useRouter();

// Mock Data (replace with actual API calls)
interface Student {
  name: string;
  sessionsRemaining: number;
  maxSessions: number;
  points: number;
}

interface SitIn {
  id: string;
  dateTime: string;
  location: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled'; // For upcoming
}

interface SitInHistoryEntry {
  id: string;
  date: string;
  location: string;
  duration: string;
  pointsEarned: number;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}

const student = ref<Student>({
  name: 'Alex Johnson',
  sessionsRemaining: 18,
  maxSessions: 30,
  points: 250,
});

const upcomingSitIns = ref<SitIn[]>([
  { id: 's1', dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), location: 'Library Section A', status: 'Confirmed' },
  { id: 's2', dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), location: 'Study Hall B12', status: 'Confirmed' },
  { id: 's3', dateTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), location: 'Quiet Zone Room 3', status: 'Pending' },
]);

const nextSitIn = computed(() => {
  return upcomingSitIns.value.filter(s => s.status === 'Confirmed').sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())[0] || null;
});

const sitInHistory = ref<SitInHistoryEntry[]>([
  { id: 'h1', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), location: 'Library Section A', duration: '2 hours', pointsEarned: 10 },
  { id: 'h2', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), location: 'Study Hall B12', duration: '1.5 hours', pointsEarned: 5 },
  { id: 'h3', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), location: 'Quiet Zone Room 3', duration: '3 hours', pointsEarned: 15 },
  { id: 'h4', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), location: 'Library Section C', duration: '1 hour', pointsEarned: 0 },
]);

const announcements = ref<Announcement[]>([
  { id: 'a1', title: 'System Maintenance Scheduled', content: 'Please be advised that the sit-in system will be down for maintenance on Sunday from 2 AM to 4 AM.', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'a2', title: 'New Sit-in Location Available', content: 'We have opened a new sit-in location in the West Wing, Room 101. It features enhanced quiet zones.', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'a3', title: 'Reminder: Quiet Hours', content: 'A friendly reminder to maintain silence in designated quiet zones to ensure a productive environment for everyone.', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
]);

// Computed properties
const sessionProgress = computed(() => (student.value.sessionsRemaining / student.value.maxSessions) * 100);

// Chart Data & Options
const chartData = ref<ChartData<'bar'>>({
  labels: [],
  datasets: [{
    label: 'Sit-ins',
    backgroundColor: '#00BD7E', // Theme primary color
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
        color: '#FFFFFF', // Changed to white
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)', // Adjusted grid line color for better contrast
      }
    },
    x: {
      ticks: {
        color: '#FFFFFF', // Changed to white
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
      titleColor: '#FFFFFF', // Explicitly white
      bodyColor: '#FFFFFF',  // Explicitly white
      borderColor: 'hsl(var(--border))',
      borderWidth: 1,
    }
  }
});

// Simulate fetching chart data
const generateChartData = () => {
  const labels = ['Week -3', 'Week -2', 'Last Week', 'This Week'];
  const data = [
    Math.floor(Math.random() * 5) + 1,
    Math.floor(Math.random() * 5) + 1,
    Math.floor(Math.random() * 5) + 1,
    Math.floor(Math.random() * 5) + 1,
  ];
  chartData.value = {
    labels,
    datasets: [{ ...chartData.value.datasets[0], data }]
  };
};

onMounted(() => {
  generateChartData();
});

// Methods for navigation (implement with your router)
const reserveSitIn = () => {
  router.push("/reservation")
};

const viewFullHistory = () => {
  router.push("/history")
};

const viewAllAnnouncements = () => {
  router.push("/announcement")
};
const viewAllUpcoming = () => {
  console.log('Navigate to all upcoming sitins page');
};

// Helper function for formatting dates
const formatDate = (dateString: string, includeTime = false) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  return new Date(dateString).toLocaleDateString(undefined, options);
};
</script>

<style scoped>
/* Additional custom styles if needed */
/* Chart.js needs a sized container to render properly */
.chart-container {
  position: relative;
  height: 300px; /* Or any desired height */
  width: 100%;
}
</style>