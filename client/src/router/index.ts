import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ProfileView from '@/views/ProfileView.vue'
import LabRulesView from '@/views/LabRulesView.vue';
import HistoryView from '@/views/HistoryView.vue';
import AnnouncementView from '@/views/AnnouncementView.vue';
import ReservationView from '@/views/ReservationView.vue';
import SearchStudentView from '@/views/SearchStudentView.vue';
import SitinsView from '@/views/SitinsView.vue';

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
      path: '/search',
      name: 'search',
      component: SearchStudentView
    },
    {
      path: '/sitins',
      name: 'sitins',
      component: SitinsView
    }
  ],
})

export default router
