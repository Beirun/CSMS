<script setup lang="ts">
import { onBeforeMount, reactive, ref, computed } from 'vue'
import { getSitinsByStudent } from '@/api/sitin'
import { setDate } from '@/library/date'
import type { SitinByStudent } from '@/types/Sitin'
// StudentTableHeaders and tableColspan are no longer needed for a card layout
import { useStudentStore } from '@/stores/student.store'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { submitFeedback } from '@/api/feedback'
import { successToast, errorToast } from '@/library/toast'
import type { SitinFeedback } from '@/types/Feedback'
import { postNotification } from '@/api/notification';
import { badwords } from '@/../badwords.json';

// Import icons (assuming you're using lucide-vue-next as from previous examples)
import { Clock, Building, ClipboardList, MessageSquareText, AlertTriangle, Send, Info } from 'lucide-vue-next';

const { student } = useStudentStore()
const sitins = ref<SitinByStudent[]>([])
const feedback = reactive<SitinFeedback>({
  sitin_feedback: '',
  sitin_id: ''
})

onBeforeMount(async () => {
  if (student && student.idno) {
    await loadHistory();
  } else {
    errorToast("Student information not available. Cannot load history.");
    console.error("Student ID not available for loading history.");
  }
})

const containsBadWords = (text: string): boolean => {
  if (!text) return false;
  const lowerCaseText = text.toLowerCase();
  if (!badwords || !Array.isArray(badwords)) {
    console.warn('Bad words list is not available or not an array.');
    return false;
  }
  for (const badWord of badwords) {
    if (typeof badWord !== 'string' || badWord.trim() === '') continue;
    const regex = new RegExp(`\\b${escapeRegExp(badWord.toLowerCase())}\\b`, 'i');
    if (regex.test(lowerCaseText)) {
      return true;
    }
  }
  return false;
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const censorBadWords = (text: string | null | undefined): string => {
  if (!text) return '';
  let censoredText = text;
  if (!badwords || !Array.isArray(badwords)) {
    console.warn('Bad words list is not available for censoring.');
    return text;
  }
  for (const badWord of badwords) {
    if (typeof badWord !== 'string' || badWord.trim() === '') continue;
    const regex = new RegExp(`\\b(${escapeRegExp(badWord)})\\b`, 'gi');
    censoredText = censoredText.replace(regex, (match) => {
      if (match.length === 1) return '*';
      if (match.length === 2) return match[0] + '*';
      if (match.length === 3) return match[0] + '*' + match[match.length -1];
      return match[0] + '*'.repeat(match.length - 2) + match[match.length - 1];
    });
  }
  return censoredText;
};

const loadHistory = async () => {
  try {
    const response = await getSitinsByStudent(student.idno)
    sitins.value = response.sitins
  } catch (error) {
    console.error("Failed to load sit-in history:", error);
    errorToast("Could not load sit-in history. Please try again.");
  }
}

const isOpen = ref(false)

const closeModal = () => {
  isOpen.value = false
  feedback.sitin_feedback = ''
  feedback.sitin_id = ''
}

const openModal = (sitin_id: string) => {
  feedback.sitin_id = sitin_id
  feedback.sitin_feedback = ''
  isOpen.value = true
}

const handleSubmitFeedback = async () => {
  if (feedback.sitin_feedback.trim() === '') {
    errorToast('Please fill out the feedback field.')
    return
  }

  let submissionBlocked = false;
  if (containsBadWords(feedback.sitin_feedback)) {
      await postNotification(student.idno, "Inappropriate Feedback Submission" , "You submitted a feedback containing inappropriate language. This has been logged and your feedback was not recorded.", "alert");
      await postNotification("0", "Inappropriate Feedback Submission by Student", `Student ${student.idno} attempted to submit feedback containing inappropriate language. The feedback was not saved.`, "alert");
      errorToast("Feedback contains inappropriate language and was not submitted. This attempt has been logged.");
      submissionBlocked = true;
  }

  if (submissionBlocked) {
    closeModal(); // Close modal even if submission is blocked due to bad words
    return;
  }

  if (!feedback.sitin_id) {
    errorToast('Error: Sit-in ID is missing. Cannot submit feedback.');
    return;
  }

  try {
    const response = await submitFeedback(feedback);
    if (response.success) {
      successToast('Feedback submitted successfully');
      closeModal();
      await loadHistory(); // Reload history to show the new feedback
    } else {
      errorToast(response.message || 'Failed to submit feedback. Please try again.');
    }
  } catch (error) {
    console.error("Error submitting feedback:", error);
    errorToast('An unexpected error occurred while submitting feedback.');
  }
}
</script>

<template>
  <div class="flex flex-col items-center min-h-screen w-full bg-[#181818] text-neutral-100 pt-20 pb-10">
    <div class="w-full  px-4 md:px-6 lg:px-8">
      <h1 class="font-bold text-gray-100 text-3xl md:text-4xl py-8 text-center md:text-left">
        Sit-in History
      </h1>

      <div v-if="sitins.length === 0" class="flex flex-col items-center justify-center text-center py-16 bg-[#222222] rounded-lg shadow-xl">
        <Info class="w-16 h-16 text-[#00BD7E] mb-6" />
        <p class="text-xl text-neutral-300 font-semibold">No Sit-in History Found</p>
        <p class="text-neutral-400 mt-2">It looks like you haven't had any sit-ins yet.</p>
        <!-- Optional: Add a button to schedule a sit-in if applicable -->
        <!-- <button class="mt-6 bg-[#00BD7E] hover:bg-[#00a46c] text-white font-semibold py-2 px-6 rounded-lg transition-colors">
          Reserve a Sit-in
        </button> -->
      </div>

      <div v-else class="space-y-6">
        <div v-for="(sitin) in sitins" :key="sitin.sitin_id"
          class="bg-[#222222] rounded-xl shadow-xl overflow-hidden transition-all hover:shadow-2xl hover:scale-[1.01]">
          <div class="p-6 md:p-8">
            <div class="flex flex-col md:flex-row justify-between items-start gap-4">
              <div class="flex-grow">
                <h2 class="text-xl font-semibold text-neutral-100 mb-2 flex items-center">
                  <ClipboardList class="w-5 h-5 mr-3 text-[#00BD7E]" />
                  {{ sitin.sitin_purpose }}
                </h2>
                <div class="flex items-center text-sm text-neutral-400 mb-1">
                  <Building class="w-4 h-4 mr-2 text-neutral-500" />
                  Laboratory: {{ sitin.sitin_laboratory }}
                </div>
                <div class="flex items-center text-sm text-neutral-400">
                  <Clock class="w-4 h-4 mr-2 text-neutral-500" />
                  Time In: {{ setDate(sitin.sitin_timein) }}
                </div>
                <div v-if="sitin.sitin_timeout" class="flex items-center text-sm text-neutral-400 mt-1">
                  <Clock class="w-4 h-4 mr-2 text-neutral-500" />
                  Time Out: {{ setDate(sitin.sitin_timeout) }}
                </div>
                 <div v-else class="flex items-center text-sm text-yellow-400 mt-1 italic">
                  <AlertTriangle class="w-4 h-4 mr-2 text-yellow-500" />
                  Session ongoing or not properly timed out.
                </div>
              </div>

              <div class="w-full md:w-auto md:text-right mt-4 md:mt-0 flex-shrink-0">
                <button
                  v-if="sitin.sitin_feedback === null && sitin.sitin_timeout"
                  @click="openModal(sitin.sitin_id)"
                  class="w-full md:w-auto inline-flex items-center justify-center bg-[#00BD7E] font-semibold text-sm hover:bg-[#00a46c] transition-all duration-300 active:scale-97 text-white px-5 py-2.5 rounded-lg shadow-md"
                >
                  <MessageSquareText class="w-4 h-4 mr-2" />
                  Submit Feedback
                </button>
                <div v-else-if="sitin.sitin_feedback !== null" class="mt-1 p-3 bg-[#2c2c2c] rounded-md text-left">
                  <p class="text-xs text-neutral-400 mb-1 font-medium">Your Feedback:</p>
                  <p class="text-sm text-neutral-300 italic line-clamp-3" :title="sitin.sitin_feedback">
                    {{ censorBadWords(sitin.sitin_feedback) }}
                  </p>
                </div>
                <div v-else class="mt-1">
                  <p class="text-sm text-neutral-500 italic">
                    Feedback N/A
                  </p>
                   <p class="text-xs text-neutral-600">(Session must be timed out)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" />
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
              class="w-full max-w-lg transform overflow-hidden rounded-2xl bg-[#2a2a2a] p-6 md:p-8 text-left align-middle shadow-2xl transition-all"
            >
              <DialogTitle as="h3" class="text-2xl font-bold leading-tight text-center text-[#00BD7E] mb-6">
                Share Your Feedback
              </DialogTitle>
              <div class="mt-4">
                <textarea
                  v-model="feedback.sitin_feedback"
                  class="w-full bg-[#383838] text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#00BD7E] rounded-lg p-4 resize-none placeholder-neutral-500"
                  cols="30"
                  rows="7"
                  placeholder="What did you think about the lab session, equipment, or environment?"
                ></textarea>
              </div>

              <div class="mt-8">
                <button
                  type="button"
                  @click="handleSubmitFeedback"
                  class="inline-flex w-full justify-center items-center rounded-lg border border-transparent bg-[#00BD7E] px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#00a46c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00BD7E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a2a2a] transition-colors duration-300 active:scale-97"
                >
                  <Send class="w-5 h-5 mr-2" />
                  Submit Feedback
                </button>
                <button
                  type="button"
                  @click="closeModal"
                  class="mt-3 inline-flex w-full justify-center rounded-lg border border-neutral-600 px-6 py-3 text-base font-semibold text-neutral-300 shadow-sm hover:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a2a2a] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped>
.line-clamp-3 { /* Changed from 2 to 3 for a bit more preview */
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
</style>