<script setup lang="ts">
import AdminNavbar from '@/components/AdminSidebar.vue'
import { onBeforeMount, ref } from 'vue'
import { getSitinFeedbacks } from '@/api/feedback'
import { setDate } from '@/library/date'
import type { StudentSitinFeedback } from '@/types/Feedback'
import { FeedbackTableHeaders    } from '@/library/table'

const sitins = ref<StudentSitinFeedback[]>([])
onBeforeMount(async () => {
  const response = await getSitinFeedbacks()
  sitins.value = response.sitins
  console.log(sitins.value)
})
</script>

<template>
  <div class="flex flex-row items-start justify-center h-screen max-w-screen pt-10">
    
    <div class="flex flex-col w-[90%]">
      <div class="w-full flex justify-between items-center py-10">
        <h1 class="text-4xl font-bold w-full">Feedbacks</h1>
        </div>
      <div class="-m-1.5 overflow-x-auto">
        <div class="p-1.5 min-w-full inline-block align-middle">
          <div class="overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                    <th v-for="(header, index) in FeedbackTableHeaders" :key="index" scope="col"
                    class="px-6 py-3 text-middle text-xl font-bold text-[#f8f8f8] uppercase">
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr :class="index % 2 === 0 ? 'bg-[#202020]' : ''" class="text-lg text-[#f8f8f8]" v-for="(sitin, index) in sitins" :key="sitin.sitin_id">
                  <td v-for="field in ['idno', 'fullname', 'course', 'yearlevel', 'sitin_purpose', 'sitin_laboratory', 'sitin_timein', 'sitin_timeout', 'sitin_feedback']" :key="field"
                    class="px-6 py-6 font-semibold text-md text-[#8e8e8e] text-center" 
                    >
                    {{ field === 'sitin_timein' || field === 'sitin_timeout' ? setDate(sitin[field as keyof StudentSitinFeedback]) : sitin[field as keyof StudentSitinFeedback] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>
