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

            <!-- Notification Item -->
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
                  class="w-80 p-0 border-[#444] bg-[#222222] text-neutral-100 shadow-xl rounded-md"
                  style="z-index: 100;"
                >
                  <!-- ... Popover Content remains the same ... -->
                  <div class="p-3 border-b border-[#333]">
                    <div class="flex justify-between items-center">
                      <h3 class="font-semibold text-md text-neutral-50">Notifications</h3>
                      <button
                        v-if="notifications.length > 0 && unreadNotificationCount > 0"
                        @click="markAllAsRead"
                        class="text-xs text-[#00BD7E] hover:underline"
                      >
                        Mark all as read
                      </button>
                    </div>
                  </div>
                  <ScrollArea class="max-h-80">
                    <div class="p-1">
                      <div v-if="notifications.length === 0" class="p-4 text-center text-sm text-neutral-400">
                        No new notifications.
                      </div>
                      <a
                        v-for="notification in notifications"
                        :key="notification.id"
                        @click="handleNotificationClick(notification)"
                        :href="notification.link || '#'"
                        class="block p-3 hover:bg-[#333333] rounded-md transition-colors"
                        :class="{ 'cursor-pointer': notification.link, 'pointer-events-none': !notification.link && !notification.action }"
                      >
                        <div class="flex items-start justify-between">
                          <span class="font-medium text-sm text-neutral-100 line-clamp-1">{{ notification.title }}</span>
                          <span v-if="!notification.read" class="ml-2 mt-1 h-2 w-2 bg-[#00BD7E] rounded-full flex-shrink-0"></span>
                        </div>
                        <p class="text-xs text-neutral-300 mt-1 line-clamp-2">{{ notification.message }}</p>
                        <p class="text-xs text-neutral-500 mt-1">{{ setDate(notification.createdAt) }}</p>
                      </a>
                    </div>
                  </ScrollArea>
                  <div v-if="notifications.length > 0" class="p-2 border-t border-[#333] text-center">
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
      <!-- ... SidebarFooter remains the same ... -->
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
// ... your script setup remains the same
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useStudentStore } from '@/stores/student.store'
import {
  LayoutDashboard, Megaphone, Users, Folder, CalendarDays, FileText,
  MessageSquare, LogOut, CalendarCheck, LaptopMinimal, Bell
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

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
  link?: string;
  action?: () => void;
}

const links = [
  { to: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/announce', label: 'Announcement', icon: Megaphone },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/resources', label: 'Resources', icon: Folder },
  { to: '/sitins', label: 'Sit-ins', icon: CalendarDays },
  { to: '/reservations', label: 'Reservations', icon: CalendarCheck },
  { to: '/leaderboard', label: 'Leaderboards', icon: CalendarCheck },
  { to: '/schedule', label: 'Schedules', icon: FileText },
  { to: '/records', label: 'Records', icon: FileText },
  { to: '/feedbacks', label: 'Feedbacks', icon: MessageSquare },
  { to: '/manage-computer', label: 'Manage PC', icon: LaptopMinimal }
];

const studentStore = useStudentStore();
const router = useRouter();
const notifications = ref<Notification[]>([]);

const unreadNotificationCount = computed(() => {
  return notifications.value.filter(n => !n.read).length;
});

onMounted(() => {
  setTimeout(() => {
    notifications.value = [
      { id: '1', title: 'New Student Registration', message: 'John Doe has registered. Review their details.', createdAt: new Date(Date.now() - 3600 * 1000 * 2), read: false, link: '/students/john-doe' },
      { id: '2', title: 'Lab Resource Update', message: 'Software XYZ updated to v2.5 in Lab 301.', createdAt: new Date(Date.now() - 3600 * 1000 * 5), read: false, action: () => console.log('Resource updated') },
      { id: '3', title: 'Feedback Received', message: 'A new feedback was submitted regarding lab cleanliness.', createdAt: new Date(Date.now() - 3600 * 1000 * 24), read: true, link: '/feedbacks/latest' },
    ];
  }, 1000);
});

const handleNotificationClick = (notification: Notification) => {
  if (!notification.read) {
    notification.read = true;
  }
  if (notification.link) {
    router.push(notification.link);
  } else if (notification.action) {
    notification.action();
  }
};

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true);
};

const viewAllNotificationsPage = () => {
  router.push('/notifications');
};

const logOut = () => {
  studentStore.setUser("none")
  router.push('/login')
};
</script>

<style scoped>
/* ... your style scoped remains the same */
.text-md, .font-bold, .text-neutral-200, .text-neutral-400 {
  color: inherit;
}
.drop-shadow-logo {
  filter: drop-shadow(0px 2px 4px rgba(0, 189, 126, 0.5));
}
</style>