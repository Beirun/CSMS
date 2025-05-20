<template>
  <Sidebar class="bg-[#181818] border-r border-[#333] text-neutral-100">
    <SidebarHeader>
      <div class="p-4 border-b flex items-center border-[#333]">
        <img
          @click="$router.push('/dashboard/admin')"
          src="@/assets/logo.svg"
          alt="Logo"
          class="cursor-pointer size-16 drop-shadow-logo"
        />
        <span class="ml-2 text-md font-bold text-neutral-100">CCS Sit-In Monitoring</span>
      </div>
    </SidebarHeader>
    <SidebarContent class="flex-grow">
      <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem v-for="link in links" :key="link.to">
              <SidebarMenuButton asChild>
                <RouterLink
                  :to="link.to"
                  class="flex items-center h-12 gap-3 px-4 py-3 rounded-md transition-colors duration-200 w-full"
                  :class="{
                    'bg-[#00BD7E] text-[#1e1e1e] font-semibold': $route.path === link.to,
                    'hover:bg-[#333] text-neutral-200': $route.path !== link.to
                  }"
                >
                  <component :is="link.icon" class="h-5 w-5 flex-shrink-0" />
                  <span class="truncate">{{ link.label }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    class="flex h-12 items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200 w-full text-left hover:bg-[#333] text-neutral-200"
                  >
                    <Bell class="h-5 w-5 flex-shrink-0" />
                    <span class="flex-grow truncate">Notifications</span>
                    <span v-if="unreadNotificationCount > 0" class="ml-auto flex items-center justify-center aspect-square bg-[#00BD7E] text-white text-xs font-semibold size-6 rounded-full">
                      {{ unreadNotificationCount > 9 ? '9+' : unreadNotificationCount }}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  side="right"
                  :side-offset="5"
                  class="w-80 p-0 border-[#444] bg-[#222222] mb-10 ml-1 text-neutral-100 shadow-xl rounded-md"
                  style="z-index: 100;"
                >
                  <div class="p-3 border-b border-[#333]">
                    <div class="flex justify-between items-center">
                      <h3 class="font-semibold text-md text-neutral-50">Recent Notifications</h3>
                      <button
                        v-if="notifications.length > 0 && unreadNotificationCount > 0"
                        @click="markAllAsRead"
                        class="text-xs text-[#00BD7E] hover:underline"
                      >
                        Mark all as read
                      </button>
                    </div>
                  </div>
                    <div class="p-1">
                      <div v-if="recentNotifications.length === 0" class="p-4 text-center text-sm text-neutral-400">
                        No new notifications.
                      </div>
                      <div
                        v-for="notification in recentNotifications"
                        :key="notification.notif_id"
                        @click="handleNotificationClick(notification)"
                        class="block p-3 hover:bg-[#333333] rounded-md transition-colors cursor-pointer"
                      >
                        <div class="flex items-start justify-between">
                          <span class="font-medium text-sm text-neutral-100 line-clamp-1">{{ notification.title }}</span>
                          <span v-if="notification.status === 'unread'" class="ml-2 mt-1 h-2 w-2 bg-[#00BD7E] rounded-full flex-shrink-0"></span>
                        </div>
                        <p class="text-xs text-neutral-300 mt-1 line-clamp-2">{{ notification.message }}</p>
                        <p class="text-xs text-neutral-500 mt-1">{{ setDate(notification.createdat) }}</p>
                      </div>
                    </div>
                  <div v-if="notifications.length > 0" class="p-2 border-t  border-[#333] text-center">
                    <button @click="viewAllNotificationsPage" class="text-sm text-[#00BD7E] hover:underline">
                      View All Notifications
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </SidebarMenuItem>
          </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <div class="p-4 border-t border-[#333] space-y-4">
        <button
          @click="logOut()"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-md bg-[#00BD7E] hover:bg-[#00BD7E]/90 text-white transition-colors duration-200"
        >
          <LogOut class="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </SidebarFooter>
  </Sidebar>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeMount } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useStudentStore } from '@/stores/student.store'
import {
  LayoutDashboard, Megaphone, Users, Folder, CalendarDays, FileText,
  MessageSquare, LogOut, CalendarCheck, LaptopMinimal, Bell, Trophy
} from 'lucide-vue-next'
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, SidebarHeader
} from "@/components/ui/sidebar"
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { setDate } from '@/library/date';
import type { Notification } from '@/types/Notification';
import { getNotifications, updateNotification } from '@/api/notification'
import { useNotificationStore } from '@/stores/student.store'
// interface Notification {
//   notif_id: string;
//   title: string;
//   message: string;
//   createdAt: Date;
//   status: string | 'read' | 'unread';
//   type: string | 'system' | 'update' | 'message' | 'alert'; // Added type, removed action
// }

const links = [
  { to: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/announce', label: 'Announcement', icon: Megaphone },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/resources', label: 'Resources', icon: Folder },
  { to: '/sitins', label: 'Sit-ins', icon: CalendarDays },
  { to: '/reservations', label: 'Reservations', icon: CalendarCheck },
  { to: '/leaderboard', label: 'Leaderboards', icon: Trophy },
  { to: '/schedule', label: 'Schedules', icon: FileText },
  { to: '/records', label: 'Records', icon: FileText },
  { to: '/feedbacks', label: 'Feedbacks', icon: MessageSquare },
  { to: '/manage-computer', label: 'Manage PC', icon: LaptopMinimal }
];

const studentStore = useStudentStore();
const { notifications , fetchNotifications} = useNotificationStore();
const router = useRouter();

const recentNotifications = computed(() => {
  return notifications.slice(0, 5);
});

const unreadNotificationCount = computed(() => {
  return notifications.filter(n => n.status === 'unread').length;
});

// onMounted(() => {
//   setTimeout(() => {
//     notifications.value = [
//       { notif_id: 'admin0', title: 'Critical System Alert', message: 'Server CPU at 95%.', createdAt: new Date(Date.now() - 3600 * 1000 * 0.2), status: 'unread', type: 'alert' },
//       { notif_id: 'admin1', title: 'New Student Registration', message: 'Jane Doe has registered. Review their details.', createdAt: new Date(Date.now() - 3600 * 1000 * 2), status: 'unread', type: 'update' }, // e.g. type: 'update'
//       { notif_id: 'admin2', title: 'Lab Resource Update Request', message: 'Prof. Smith requests update for Software XYZ.', createdAt: new Date(Date.now() - 3600 * 1000 * 5), status: 'unread', type: 'message' }, // e.g. type: 'message'
//       { notif_id: 'admin3', title: 'Feedback Received', message: 'A new feedback was submitted regarding lab cleanliness.', createdAt: new Date(Date.now() - 3600 * 1000 * 24), status: 'read', type: 'message' },
//       { notif_id: 'admin4', title: 'System Maintenance Completed', message: 'Scheduled maintenance finished successfully.', createdAt: new Date(Date.now() - 3600 * 1000 * 30), status: 'read', type: 'system' },
//       { notif_id: 'admin5', title: 'Old Admin Log 1', message: 'User export completed.', createdAt: new Date(Date.now() - 3600 * 1000 * 50), status: 'read', type: 'system' },
//       { notif_id: 'admin6', title: 'Old Admin Log 2', message: 'Backup successful.', createdAt: new Date(Date.now() - 3600 * 1000 * 80), status: 'unread', type: 'system' },
//     ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
//   }, 1000);
// });
onBeforeMount(async() => {
  fetchNotifications("0")
})

const handleNotificationClick = async (notification: Notification) => {
  if (notification.status === 'unread') {
    const originalNotification = notifications.find(n => n.notif_id === notification.notif_id);
    if (originalNotification) {
        originalNotification.status = 'read';
    }
    await updateNotification(notification.notif_id);
    fetchNotifications("0")
    // API call to mark as read
  }
  // If specific navigation is needed from popover based on type/title, add logic here.
  // Example: if (notification.type === 'update' && notification.title.includes('Registration')) router.push('/students');
};

const markAllAsRead = async() => {
  notifications.forEach(async (n) => {
    if (n.status === 'unread') {
      n.status = 'read';
      await updateNotification(n.notif_id);
      fetchNotifications("0")
    }
  });
  // API call to mark all as read
};

const viewAllNotificationsPage = () => {
  router.push('/notifications');
};

const logOut = () => {
  studentStore.setUser("none")
  router.push('/login')
  studentStore.setStudent(null);
};
</script>

<style scoped>
.text-md, .font-bold, .text-neutral-200, .text-neutral-400 {
  color: inherit;
}
.drop-shadow-logo {
  filter: drop-shadow(0px 2px 4px rgba(0, 189, 126, 0.5));
}
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>