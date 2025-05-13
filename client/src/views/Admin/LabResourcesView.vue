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
  <div class="flex flex-col items-center justify-center min-h-screen max-w-screen text-white pt-10 gap-10 px-10">
    <div class="w-full flex justify-between items-center">
      <h1 class="text-4xl font-bold w-full">Lab Resources</h1>
      <button @click="uploadDialog.isOpen = true"
        class="bg-[#008F5F] rounded-md w-50 p-4 text-xl font-semibold hover:bg-[#008F5F]/70 text-[#2e2e2e] transition-all duration-300 cursor-pointer">
        <i class="pi pi-plus text-lg font-bold"></i> Upload File
      </button>
      <Dialog :isOpen="uploadDialog.isOpen" :closeModal="uploadDialog.closeModal"
        class="bg-[#2e2e2e] w-170 h-1/3 rounded-lg shadow-md shadow-black flex flex-col items-center justify-center"
        >
        <div class="p-4 w-170 h-120 flex flex-col items-center justify-center"
          :class="{'opacity-50 pointer-events-none': isUploading}"
          >
          <div v-if="isUploading" class="absolute inset-0 bg-black opacity-50 flex items-center justify-center">
            <h2 class="text-white text-2xl font-bold">Uploading...</h2>
          </div>
        
          <h1 class="text-2xl font-bold mb-10">Upload File</h1>
          <div class="flex items-center justify-center w-full">
            <label for="dropzone-file"
              class="transition-all duration-300 flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div v-if="uploadFile" class="mb-4 text-4xl font-bold text-gray-500 dark:text-gray-400 ">
                  <i class="pi pi-file text-4xl "></i><span class="pl-4">{{ uploadFile.name }}</span>

                </div>
              <div v-else class="flex flex-col items-center justify-center pt-5 pb-6">
                
                <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span class="font-semibold">Click to upload</span> or drag and drop
                </p>
                <!-- <p class="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p> -->
              </div>
              <input @change="handleFileChange" id="dropzone-file" type="file" class="hidden" />
            </label>
          </div>
          <div class="flex items-center justify-center w-full mt-10">
            <button @click="handleUploadFile"
              class="bg-[#00BD7E] rounded-md w-full p-4 text-xl font-semibold hover:bg-[#00BD7E]/70 text-[#2e2e2e] transition-all duration-300 cursor-pointer">
              Upload
            </button>
          </div>
        </div>
      </Dialog>
    </div>
    <div class="min-h-[75vh] mb-8 bg-[#222222] w-full rounded-xl shadow-md shadow-black  grid grid-cols-3 lg:grid-cols-5 place-items-center ">
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
          <i v-if="file.toLowerCase().endsWith('.docx') || file.toLowerCase().endsWith('.doc')" class="pi pi-file-word text-7xl md:text-8xl text-blue-500"></i>
          <i v-else-if="file.toLowerCase().endsWith('.xlsx') || file.toLowerCase().endsWith('.xls')" class="pi pi-file-excel text-7xl md:text-8xl text-green-500"></i>
          <i v-else-if="file.toLowerCase().endsWith('.pptx') || file.toLowerCase().endsWith('.ppt')" class="pi pi-file-powerpoint text-7xl md:text-8xl text-orange-500"></i>
          <i v-else-if="file.toLowerCase().endsWith('.pdf')" class="pi pi-file-pdf text-7xl md:text-8xl text-red-500"></i>
          <i v-else-if="['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'].some(ext => file.toLowerCase().endsWith(ext))" class="pi pi-image text-7xl md:text-8xl text-amber-500"></i>
          <i v-else-if="['.zip', '.rar', '.7z', '.tar', '.gz'].some(ext => file.toLowerCase().endsWith(ext))" class="pi pi-file-zip text-7xl md:text-8xl text-yellow-600"></i>
          <i v-else-if="['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv'].some(ext => file.toLowerCase().endsWith(ext))" class="pi pi-video text-7xl md:text-8xl text-purple-500"></i>
          <i v-else-if="['.mp3', '.wav', '.aac', '.ogg', '.flac', '.m4a'].some(ext => file.toLowerCase().endsWith(ext))" class="pi pi-volume-up text-7xl md:text-8xl text-sky-500"></i>
          <i v-else-if="file.toLowerCase().endsWith('.txt')" class="pi pi-file-alt text-7xl md:text-8xl text-slate-400"></i>
          <i v-else-if="['.js', '.ts', '.jsx', '.tsx', '.html', '.css', '.scss', '.json', '.xml', '.py', '.java', '.cs', '.php', '.rb', '.go', '.c', '.cpp', '.swift', '.kt', '.md'].some(ext => file.toLowerCase().endsWith(ext))" class="pi pi-code text-7xl md:text-8xl text-indigo-500"></i>
          <i v-else class="pi pi-file text-7xl md:text-8xl text-gray-400"></i>
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
