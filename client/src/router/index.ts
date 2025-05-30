import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/User/DashboardView.vue'
import ProfileView from '@/views/ProfileView.vue'
import LabRulesView from '@/views/User/LabRulesView.vue';
import HistoryView from '@/views/User/HistoryView.vue';
import AnnouncementView from '@/views/User/AnnouncementView.vue';
import ReservationView from '@/views/User/ReservationView.vue';
import SearchStudentView from '@/views/Admin/StudentsView.vue';
import SitinsView from '@/views/Admin/SitinsView.vue';
import CreateAnnouncementView from '@/views/Admin/CreateAnnouncementView.vue';
import SitinRecordsView from '@/views/Admin/SitinRecordsView.vue';
import FeedbackView from '@/views/Admin/FeedbackView.vue';
import AdminDashboardView from '@/views/Admin/DashboardView.vue';
import LabResourcesView from '@/views/Admin/LabResourcesView.vue';
import LeaderboardView from '@/views/Admin/LeaderboardView.vue';
import StudentLabResourcesView from '@/views/User/LabResourcesView.vue';
import AdminReservationView from '@/views/Admin/ReservationsView.vue';
import LabScheduleView from '@/views/Admin/LabScheduleView.vue';
import ComputerManagementView from '@/views/Admin/ComputerManagementView.vue';
import NotificationsView from '@/views/NotificationsView.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/dashboard/admin',
      name: 'admin-dashboard',
      component: AdminDashboardView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/lab-rules',
      name: 'lab-rules',
      component: LabRulesView
    },
    {
      path: '/history',
      name: 'history',
      component: HistoryView
    },
    {
      path: '/announcement',
      name: 'announcement',
      component: AnnouncementView
    },
    {
      path: '/reservation',
      name: 'reservation',
      component: ReservationView
    },
    {
      path: '/students',
      name: 'students',
      component: SearchStudentView
    },
    {
      path: '/sitins',
      name: 'sitins',
      component: SitinsView
    },
    {
      path: '/announce',
      name: 'announce',
      component: CreateAnnouncementView
    },
    {
      path: '/records',
      name: 'records',
      component: SitinRecordsView
    },
    {
      path: '/feedbacks',
      name: 'feedbacks',
      component: FeedbackView
    },
    {
      path: '/resources',
      name: 'resources',
      component: LabResourcesView
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: LeaderboardView
    },
    {
      path: '/student/resources',
      name : 'student-resources',
      component: StudentLabResourcesView
    },
    {
      path: '/reservations',
      name: 'reservations',
      component: AdminReservationView
    },
    {
      path: '/schedule',
      name: 'schedule',
      component: LabScheduleView
    },{
      path: '/manage-computer',
      name: 'manage-computer',
      component: ComputerManagementView
    },
    {
      path:'/notifications',
      name:'/notifications',
      component: NotificationsView
    }
  ],
})

export default router
