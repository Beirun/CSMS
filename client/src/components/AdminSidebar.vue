
<template>
  <Sidebar>
    <SidebarHeader>
      <div class="p-4 border-b flex items-center border-[#333]">
        <img
          @click="$router.push('/dashboard')"
          src="@/assets/logo.svg"
          alt="Logo"
          class="cursor-pointer size-16 drop-shadow-logo"
        />
        <span class="text-md font-bold">CCS Sit-In Monitoring System</span>
      </div>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
              <SidebarMenuItem  v-for="link in links" :key="link.to">
                <SidebarMenuButton asChild>
                  <RouterLink 
           
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200"
            :class="{
              'bg-[#00BD7E] text-white': $route.path === link.to,
              'hover:bg-[#333]': $route.path !== link.to
            }"
          >
            <component :is="link.icon" class="h-5 w-5" />
            <span>{{ link.label }}</span>
          </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
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
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useStudentStore } from '@/stores/student.store'
import { 
  LayoutDashboard,
  Megaphone,
  Users,
  Folder,
  CalendarDays,
  FileText,
  MessageSquare,
  LogOut,
  CalendarCheck
} from 'lucide-vue-next'
import Button from './ui/button/Button.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader
} from "@/components/ui/sidebar"


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
  { to: '/feedbacks', label: 'Feedbacks', icon: MessageSquare }
]

const studentStore = useStudentStore()

const router = useRouter()

const logOut = () => {
  console.log('Logging out...')
  studentStore.setUser("none")
  router.push('/login')
}

</script>

<style scoped>

</style>