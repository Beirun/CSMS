<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { PC } from '@/types/PC'
import { getPCs, updatePC } from '@/api/pc'
// Sample data - all properties are now strings
const pcs = ref<PC[]>([])

onBeforeMount(async()=>{
    const response = await getPCs()
    console.log(response.pcs)
    pcs.value = response.pcs
})
const selectedLab = ref('517')
const isLoading = ref(false)

const labs = computed(() => {
  return [...new Set(pcs.value.map(pc => pc.labno))].sort()
})

const filteredPCs = computed(() => {
  return pcs.value
    .filter(pc => pc.labno === selectedLab.value)
    .sort((a, b) => parseInt(a.pcno) - parseInt(b.pcno))
})

const stats = computed(() => {
  const available = filteredPCs.value.filter(pc => pc.status === 'Available').length
  const used = filteredPCs.value.filter(pc => pc.status === 'Used').length
  return { available, used }
})

const toggleStatus = async (pc: PC) => {
  pc.status = pc.status === 'Available' ? 'Used' : 'Available'
  await updatePC(pc)
  // Here you would typically call an API to update the status
}

const refreshData = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 800)
}
</script>

<template>
  <div class="min-h-screen bg-[#181818] text-gray-100 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-[#00BD7E] mb-2">Computer Lab Management</h1>
        <p class="text-gray-400">Monitor and manage PC status in real-time</p>
      </div>

      <!-- Controls -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div class="flex items-center gap-3">
          <Select v-model="selectedLab">
            <SelectTrigger class="w-[180px] bg-[#222222] border-[#333333]">
              <SelectValue placeholder="Select lab" />
            </SelectTrigger>
            <SelectContent class="bg-[#222222] border-[#333333]">
              <SelectItem 
                v-for="lab in labs" 
                :key="lab" 
                :value="lab"
                class="hover:bg-[#2a2a2a]"
              >
                Lab {{ lab }}
              </SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            class="bg-[#222222] border-[#333333] hover:bg-[#2a2a2a]"
            @click="refreshData"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mr-2"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>
            Refresh
          </Button>
        </div>

        <div class="flex gap-4">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-[#00BD7E]"></div>
            <span class="text-sm">{{ stats.available }} Available</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-red-500"></div>
            <span class="text-sm">{{ stats.used }} In Use</span>
          </div>
        </div>
      </div>

      <!-- PCs Grid -->
      <div v-if="isLoading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <Card v-for="i in 6" :key="i" class="bg-[#222222] border-[#333333]">
          <CardHeader>
            <Skeleton class="h-6 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton class="h-4 w-full mb-2" />
            <Skeleton class="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>

      <div v-else-if="filteredPCs.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <Card 
          v-for="pc in filteredPCs" 
          :key="`${pc.labno}-${pc.pcno}`"
          class="bg-[#222222] border-[#333333] transition-all cursor-pointer"
          :class="{
            'hover-glow-primary': pc.status === 'Available',
            'hover-glow-red': pc.status === 'Used',
            'border-[#00BD7E]/30': pc.status === 'Available',
            'border-red-500/30': pc.status === 'Used'
          }"
          @click="toggleStatus(pc)"
        >
          <CardHeader class="pb-2">
            <CardTitle class="text-lg flex justify-between items-center">
              <span>PC {{ pc.pcno }}</span>
              <div 
                class="w-3 h-3 rounded-full"
                :class="{
                  'bg-[#00BD7E]': pc.status === 'Available',
                  'bg-red-500': pc.status === 'Used'
                }"
              ></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex justify-between items-center">
              <Badge 
                variant="outline"
                :class="{
                  'bg-[#00BD7E]/20 text-[#00BD7E] border-[#00BD7E]/30': pc.status === 'Available',
                  'bg-red-500/20 text-red-400 border-red-500/30': pc.status === 'Used'
                }"
              >
                {{ pc.status }}
              </Badge>
              <span class="text-sm text-gray-400">Lab {{ pc.labno }}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Empty State -->
      <Card v-else class="bg-[#222222] border-[#333333] text-center py-12">
        <CardContent>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="mx-auto text-gray-500 mb-4"
          >
            <rect width="14" height="8" x="5" y="2" rx="2" />
            <rect width="20" height="8" x="2" y="14" rx="2" />
            <path d="M6 18h2" />
            <path d="M12 18h6" />
          </svg>
          <h3 class="text-lg font-medium text-gray-300 mb-1">No PCs found</h3>
          <p class="text-gray-500">Select a different lab or check back later</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<style>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #222222;
}

::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Glow Effects */
.hover-glow-primary {
  transition: box-shadow 0.2s ease;
}

.hover-glow-primary:hover {
  box-shadow: 0 0 15px rgba(0, 189, 126, 0.5);
}

.hover-glow-red {
  transition: box-shadow 0.2s ease;
}

.hover-glow-red:hover {
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.5);
}

/* Status dot animation */
.w-3.h-3.rounded-full {
  transition: transform 0.2s ease;
}

.card:hover .w-3.h-3.rounded-full {
  transform: scale(1.2);
}
</style>