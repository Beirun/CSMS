<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { ref } from 'vue'
import { getDownloadUrl, getFiles } from '@/api/resource';
import AdminNavbar from '@/components/AdminNavbar.vue';

const loaded = ref(false)
const files = ref<string[]>([])
onBeforeMount(async () => {
    const response = await getFiles();
    if (response.success) {
        files.value = response.files;
        loaded.value = true
    }
})

const downloadFile = async (index: number) => {
    const response = await getDownloadUrl(index);
    if (response.success) {
        const url = response.url;
        const a = document.createElement('a');
        a.href = url;
        a.download = files.value[index];
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}
</script>

<template>
    <AdminNavbar />
    <div class="flex flex-col items-center justify-center min-h-screen w-screen text-white pt-25 gap-10 px-10">
        <h1 class="text-4xl font-bold w-full">Lab Resources</h1>
        <div class="min-h-[75vh] bg-[#222222] w-full rounded-xl shadow-md shadow-black flex flex-wrap justify-evenly">
            <div v-if="!loaded" class="m-8" v-for="index in 12" :key="index">
                <div class="size-50 bg-[#3a3a3a] rounded-lg animate-pulse">

                </div>
                <div class="animate-pulse rounded-lg bg-[#3a3a3a] w-full h-5 mt-4"></div>
            </div>
            <div v-if="loaded && files.length === 0" class="text-center w-full flex items-center justify-center">
                <h1 class="text-3xl font-bold">No files found</h1>
            </div>
            <div v-else v-for="(file, index) in files" :key="index" class="m-8">
                <div @click="downloadFile(index)"
                    class="active:bg-[#353535] size-50 bg-[#313131] rounded-lg flex justify-center items-center hover:bg-[#3a3a3a] transition-colors duration-300 cursor-pointer">
                    <i v-if="file.endsWith('.docx')" class="pi pi-file-word text-8xl text-blue-500"></i>
                    <i v-else-if="file.endsWith('.pdf')" class="pi pi-file-pdf text-8xl text-red-500"></i>
                    <i v-else-if="file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')"
                        class="pi pi-image text-8xl text-amber-500"></i>
                    <i v-else class="pi pi-file text-8xl"></i>

                </div>
                <div class="text-xl my-4 w-50 text-center truncate">{{ file }}</div>
            </div>
        </div>

    </div>
</template>
