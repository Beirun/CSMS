<script setup lang="ts">
import { onBeforeMount, reactive } from 'vue'
import { ref } from 'vue'
import { getDownloadUrl, getFiles } from '@/api/resource'
import AdminNavbar from '@/components/AdminSidebar.vue'
import Dialog from '@/components/ConfirmationDialog.vue'
import { uploadFileApi } from '@/api/resource'
const uploadDialog = reactive({
  isOpen: false,
  closeModal: () => {
    uploadDialog.isOpen = false
  },
})

const fileDownloadIndex = ref<number>(-1)
const isUploading = ref(false)
const isDownloading = ref(false)
const uploadFile = ref<File>()
const loaded = ref(false)
const files = ref<string[]>([])
onBeforeMount(async () => {
  const response = await getFiles()
  if (response.success) {
    files.value = response.files
    loaded.value = true
  }
})

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    uploadFile.value = target.files[0]
    console.log('Selected file:', uploadFile.value)
  }
}

const handleUploadFile = async () => {
  isUploading.value = true
  if (uploadFile.value) {

    const response = await uploadFileApi(uploadFile.value)
    console.log('Upload response:', response)
    if (response.success) {

      isUploading.value = false
      uploadDialog.closeModal()

      loaded.value = false
      const filesResponse = await getFiles()
      if (filesResponse.success) {
        files.value = filesResponse.files
        loaded.value = true
      }
    }
  }
}

const downloadFile = async (index: number) => {
  isDownloading.value = true
  fileDownloadIndex.value = index
  const response = await getDownloadUrl(index)
  if (response.success) {
    const url = response.url
    const a = document.createElement('a')
    a.href = url
    a.download = files.value[index]
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    isDownloading.value = false
    fileDownloadIndex.value = -1
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen max-w-screen text-white  gap-10 px-10">
    <div class="w-full flex justify-between items-center">
      <h1 class="text-4xl font-bold w-full">Lab Resources</h1>
      
    </div>
    <div class="min-h-[75vh] mb-8 bg-[#222222] w-full rounded-xl shadow-md shadow-black flex flex-wrap justify-evenly">
      <div v-if="!loaded" class="m-8" v-for="index in 12" :key="index">
        <div class="size-50 bg-[#3a3a3a] rounded-lg animate-pulse"></div>
        <div class="animate-pulse rounded-lg bg-[#3a3a3a] w-full h-5 mt-4"></div>
      </div>
      <div v-if="loaded && files.length === 0" class="text-center w-full flex items-center justify-center">
        <h1 class="text-3xl font-bold">No files found</h1>
      </div>
      <div v-else v-for="(file, index) in files" :key="index" class="m-8" v-if="loaded">
        <div @click="downloadFile(index)" :class="{ 'pointer-events-none': isDownloading }"
          class="relative active:bg-[#353535] size-50 bg-[#313131] rounded-lg flex justify-center items-center hover:bg-[#3a3a3a] transition-colors duration-300 cursor-pointer group overflow-hidden">
          <!-- File Icon -->
          <i v-if="file.endsWith('.docx')" class="pi pi-file-word text-8xl text-blue-500"></i>
          <i v-else-if="file.endsWith('.pdf')" class="pi pi-file-pdf text-8xl text-red-500"></i>
          <i v-else-if="file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')"
            class="pi pi-image text-8xl text-amber-500"></i>
          <i v-else class="pi pi-file text-8xl"></i>

          <!-- Download Overlay -->
          <div
            :class="{'opacity-0': fileDownloadIndex !== index, 'opacity-70': fileDownloadIndex === index}"
            class="absolute inset-0 bg-black flex items-center justify-center  group-hover:opacity-70 transition-opacity duration-300">
            <h2 class="text-white text-xl font-bold">{{ isDownloading ? "Downloading..." : "Download" }}</h2>
          </div>
        </div>
        <div class="text-xl my-4 w-50 text-center truncate">{{ file }}</div>
      </div>
    </div>
  </div>
</template>
