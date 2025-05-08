<script setup lang="ts">
import { RouterView } from 'vue-router'
import {Toaster, toast} from 'vue-sonner'
import 'remixicon/fonts/remixicon.css'
import { useStudentStore } from './stores/student.store'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import StudentSidebar from '@/components/StudentSidebar.vue'
import AdminSidebar from '@/components/AdminSidebar.vue'

const studentStore = useStudentStore();
console.log("app type",studentStore.user.type)
</script>

<template>
  <Toaster richColors theme="dark"/>
  <SidebarProvider v-if="studentStore.user.type=== 'admin'">
    <AdminSidebar />
      <main class="w-screen">
      <RouterView />
    </main>
  </SidebarProvider>
  <SidebarProvider v-else-if="studentStore.user.type=== 'student'">
    <StudentSidebar />
    <main class="w-screen">
      <RouterView />
    </main>
  </SidebarProvider>
  <RouterView v-else-if="studentStore.user.type === 'none'"/>
</template>


