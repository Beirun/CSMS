<script setup lang="ts">
import NavbarDashboard from '@/components/StudentSidebar.vue';
import { onBeforeMount, reactive, ref } from 'vue'
import { getSitinsByStudent } from '@/api/sitin'
import { setDate } from '@/library/date'
import type { SitinByStudent } from '@/types/Sitin'
import { StudentTableHeaders } from '@/library/table'
import { useStudentStore } from '@/stores/student.store'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { submitFeedback } from '@/api/feedback'
import { successToast, errorToast } from '@/library/toast'
import type { SitinFeedback } from '@/types/Feedback'

const {student} = useStudentStore()
const sitins = ref<SitinByStudent[]>([])
const feedback = reactive<SitinFeedback>({
  sitin_feedback: '',
  sitin_id: ''
})
onBeforeMount(async () => {
  await loadHistory()
})

const loadHistory = async () => {
  const response = await getSitinsByStudent(student.idno)
  sitins.value = response.sitins
  console.log("sitins",sitins.value)
}

const isOpen = ref(false)
const closeModal = () => {
  isOpen.value = false
}
const openModal = (sitin_id: string) => {
  feedback.sitin_id = sitin_id
  console.log("sitin_id",sitin_id)
  isOpen.value = true
}
const handleSubmitFeedback = async () => {

  if (feedback.sitin_feedback.trim() === '') {
    errorToast('Please fill out all the fields')
    return
  }
  const response = await submitFeedback(feedback)
  if (response.success) {
    successToast('Feedback submitted successfully')
    feedback.sitin_feedback = ''
    feedback.sitin_id = ''
    closeModal()
    await loadHistory()
  }
}
</script>
<template>
    <div class="flex flex-row items-start justify-center min-h-screen max-w-screen pt-20">
      
    <div class="flex flex-col w-[85%]">
      <div class="font-bold text-gray-100 text-4xl py-5 ">
        Sitin History
      </div>
      <div class="-m-1.5 overflow-x-auto">
        <div class="p-1.5 min-w-full inline-block align-middle">
          <div class="overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th v-for="(header, index) in StudentTableHeaders" :key="index" scope="col"
                    class="px-6 py-3 text-middle text-xl font-bold text-[#f8f8f8] uppercase">
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr :class="index % 2 === 0 ? 'bg-[#202020]' : ''" class="text-lg text-[#f8f8f8]" v-for="(sitin, index) in sitins" :key="sitin.sitin_id">
                  <td v-for="field in ['idno','sitin_purpose', 'sitin_laboratory', 'sitin_timein', 'sitin_timeout']" :key="field"
                    class="px-6 py-6 whitespace-nowrap font-semibold text-md text-[#8e8e8e]" :class="field ==='sitin_laboratory'? 'w-20 text-center': ''">
                    {{ field === 'sitin_timein' || field === 'sitin_timeout' ? setDate(sitin[field as keyof SitinByStudent]) : sitin[field as keyof SitinByStudent] }}</td>
                    <td class="text-center w-100 px-" v-if="sitin.sitin_feedback === null">
                      <button @click="openModal(sitin.sitin_id)" class="bg-[#00BD7E]/70 font-semibold text-lg hover:bg-[#00BD7E]/90 transition-all duration-300 active:scale-97 active:bg-primary/60 cursor-pointer  text-[#f8f8f8] px-4 py-2 rounded-md ">
                        Submit Feedback
                      </button>
                    </td>
                    <td class="text-center px-4" v-else>
                      {{ sitin.sitin_feedback }}
                    </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="closeModal" class="relative z-10">
          <TransitionChild
            as="template"
            enter="duration-200 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black/50" />
          </TransitionChild>

          <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
              >
                <DialogPanel
                  class="text-lg flex justify-center items-center w-200 h-150 bg-[#2e2e2e] transform overflow-hidden rounded-xl p-6 text-left align-middle shadow-xl transition-all"
                >
                <div class="flex flex-col gap-5 justify-between items-center h-full py-5 pt-10">
                    <DialogTitle as="h3" class="text-5xl font-bold leading-6 text-[#00BD7E]">FEEDBACK</DialogTitle>
                    <textarea v-model="feedback.sitin_feedback" class="bg-[#3a3a3a] focus:outline-none rounded-md p-5 resize-none " cols="75" rows="9" placeholder="What do you think about the lab?"></textarea>
                    <button
                    @click="handleSubmitFeedback"
                    class="focus:outline-none w-full h-15 px-5 py-2 rounded text-[#ffff] font-semibold cursor-pointer text-lg bg-[#00BD7E] hover:bg-[#00BD7E]/65 transition-colors duration-400"
                  >
                    SUBMIT FEEDBACK
                  </button>
                </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
</template>