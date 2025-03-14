<script setup lang="ts">
import AdminNavbar from '@/components/AdminNavbar.vue'
import { onBeforeMount, ref } from 'vue'
import { getSitins } from '@/api/sitin'
import { setDate } from '@/library/date'
import type { Sitin } from '@/types/Sitin'
import { tableHeaders } from '@/library/table'

const sitins = ref<Sitin[]>([])
onBeforeMount(async () => {
  const response = await getSitins()
  sitins.value = response.sitins
  console.log(sitins.value)
})
</script>

<template>
  <AdminNavbar />
  <div class="flex flex-row items-start justify-center h-screen w-screen pt-40">
    <div class="flex flex-col w-[85%]">
      <div class="-m-1.5 overflow-x-auto">
        <div class="p-1.5 min-w-full inline-block align-middle">
          <div class="overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    v-for="header in tableHeaders"
                    scope="col"
                    class="px-6 py-3 text-middle text-md font-medium text-[#f8f8f8] uppercase"
                  >
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="(sitin, index) in sitins" :key="sitin.sitin_id">
                  <td v-for="(values, index2) in sitin" :key="index" class="px-6 py-4 whitespace-nowrap text-md text-[#8e8e8e]">{{ index2 === 'sitin_timein' || index2 === 'sitin_timeout' ? setDate(values) : values }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
