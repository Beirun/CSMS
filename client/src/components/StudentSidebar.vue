<script setup lang="ts">
import { ref, computed, onMounted } from 'vue' // Added ref, computed, onMounted
import { RouterLink, useRouter } from 'vue-router'
import { useStudentStore } from '@/stores/student.store'
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, SidebarHeader
} from "@/components/ui/sidebar"
import {
  Megaphone, BookOpen, History, Folder, CalendarCheck, User, LogOut, Bell // Added Bell
} from 'lucide-vue-next'
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover' // Added Popover
import { ScrollArea } from '@/components/ui/scroll-area' // Import ScrollArea
import { setDate } from '@/library/date'; // Adjust path as needed


interface Notification { // Same interface
  id: string;
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
  link?: string;
  action?: () => void;
}

const studentStore = useStudentStore()

const links = [
  { to: '/announcement', label: 'Announcement', icon: Megaphone },
  { to: '/lab-rules', label: 'Lab Rules', icon: BookOpen },
  { to: '/history', label: 'Sitin History', icon: History },
  { to: '/student/resources', label: 'Lab Resources', icon: Folder },
  { to: '/reservation', label: 'Reservation', icon: CalendarCheck },
  { to: '/profile', label: 'Profile', icon: User }
]

const router = useRouter()

const notifications = ref<Notification[]>([]); // Student notifications

const unreadNotificationCount = computed(() => {
  return notifications.value.filter(n => !n.read).length;
});

onMounted(() => {
  // Mock fetching student notifications
  setTimeout(() => {
    notifications.value = [
      { id: 's1', title: 'Reservation Approved', message: 'Your reservation for Lab 302 on Oct 28, 2-4 PM is approved.', createdAt: new Date(Date.now() - 3600 * 1000 * 1), read: false, link: '/reservation' },
      { id: 's2', title: 'New Announcement', message: 'Midterm exam schedule has been posted.', createdAt: new Date(Date.now() - 3600 * 1000 * 6), read: true, link: '/announcement' },
    ];
  }, 1200);
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
}

const viewAllNotificationsPage = () => {
  router.push('/notifications'); // Example route
}

const logOut = () => {
  studentStore.setUser("none")
  router.push('/login')
}
</script>

<template>
  <Sidebar class="bg-[#181818] border-r border-[#333] text-neutral-100">
    <SidebarHeader>
      <div class="p-4 border-b flex items-center border-[#333]">
        <img
          @click="$router.push('/dashboard')" 
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
                  class="flex h-12 items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200"
                  :class="{
                    'bg-[#00BD7E] text-white': $route.path === link.to,
                    'hover:bg-[#333] text-neutral-200': $route.path !== link.to
                  }"
                >
                  <component :is="link.icon" class="h-5 w-5" />
                  <span>{{ link.label }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    class="flex h-12 items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200 w-full text-left hover:bg-[#333] text-neutral-200"
                  >
                    <Bell class="h-5 w-5" />
                    <span>Notifications</span>
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
      <div class="p-4 border-t border-[#333] space-y-4">
        <div v-if="studentStore.student" class="text-sm text-neutral-100">
          <div class="font-medium">{{ studentStore.student.firstname }} {{ studentStore.student.lastname }}</div>
          <div class="text-neutral-400">{{ studentStore.student.idno }}</div>
        </div>
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

<style scoped>
.text-md, .font-bold, .text-neutral-200, .text-neutral-400 {
  color: inherit;
}
.drop-shadow-logo {
  filter: drop-shadow(0px 2px 4px rgba(0, 189, 126, 0.5));
}
</style>