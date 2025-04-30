<template>
    <AdminNavbar />
    <div class="min-h-screen bg-[#181818] text-white p-6 pt-25">
        <div class="max-w-6xl mx-auto ">
            <h1 class="text-4xl font-bold mb-8 text-center text-[#00BD7E]">Leaderboard</h1>

            <!-- Top 3 Pedestal -->
            <div class="flex gap-6 w-full justify-between mb-12 items-end">
                <!-- 2nd Place -->
                <div class="flex flex-col items-center w-100">
                    <div class="relative mb-4">
                        <div
                            class="w-32 h-32 rounded-full border-4 border-[#00BD7E] overflow-hidden bg-[#2e2e2e] flex item-center justify-center">
                            <!-- <img 
                  v-if="leaderboard[1]?.poke_icon" 
                  :src="leaderboard[1].poke_icon" 
                  alt="Profile"
                  class="w-full h-full object-cover"
                /> -->
                            <div :style="{ 'background-image': toBase64(leaderboard[1].poke_icon) }"
                                class="absolute size-30 rounded-full bg-contain bg-no-repeat bg-bottom bg-[#202020]" />
                            <!-- <div v-else class="w-full h-full flex items-center justify-center bg-gray-700">
                  <UserIcon class="w-16 h-16 text-gray-400" />
                </div> -->
                        </div>
                        <div
                            class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[#00BD7E] text-white font-bold rounded-full w-10 h-10 flex items-center justify-center">
                            {{ leaderboard[1]?.rank || 2 }}
                        </div>
                    </div>
                    <div class="text-center">
                        <h3 class="text-xl font-semibold">{{ leaderboard[1]?.fullname || 'Player 2' }}</h3>
                        <h2 class="text-md">{{ leaderboard[1]?.idno || 'Player 2' }}</h2>
                        <p class="text-[#00BD7E] font-bold">{{ leaderboard[1]?.points || 0 }} pts</p>
                    </div>
                    <div class="mt-4 w-full h-8 bg-[#313131] rounded-t-lg"></div>
                </div>

                <!-- 1st Place -->
                <div class="flex flex-col items-center w-100">
                    <div class="relative mb-4">
                        <div
                            class="w-40 h-40 rounded-full border-4 border-[#00BD7E] overflow-hidden bg-gray-800 flex item-center justify-center">
                            <div :style="{ 'background-image': toBase64(leaderboard[0].poke_icon) }"
                                class="absolute size-38 rounded-full bg-contain bg-no-repeat bg-[#202020] " />
                            <!-- <div v-else class="w-full h-full flex items-center justify-center bg-gray-700">
                  <UserIcon class="w-20 h-20 text-gray-400" />
                </div> -->
                        </div>
                        <div
                            class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[#00BD7E] text-white font-bold rounded-full w-12 h-12 flex items-center justify-center text-xl">
                            {{ leaderboard[0]?.rank || 1 }}
                        </div>
                    </div>
                    <div class="text-center">
                        <h3 class="text-2xl font-bold">{{ leaderboard[0]?.fullname || 'Player 1' }}</h3>
                        <h2 class="text-md">{{ leaderboard[0]?.idno || 'Player 1' }}</h2>

                        <p class="text-[#00BD7E] font-bold text-xl">{{ leaderboard[0]?.points || 0 }} pts</p>
                    </div>
                    <div class="mt-4 w-full h-16 bg-[#00BD7E] rounded-t-lg"></div>
                </div>

                <!-- 3rd Place -->
                <div class="flex flex-col items-center w-100">
                    <div class="relative mb-4">
                        <div
                            class="w-28 h-28 rounded-full border-4 border-[#00BD7E] overflow-hidden bg-gray-800 flex item-center justify-center">
                            <div :style="{ 'background-image': toBase64(leaderboard[2].poke_icon) }"
                                class="absolute size-26 rounded-full bg-contain bg-no-repeat bg-bottom bg-[#202020]" />
                            <!-- <div v-else class="w-full h-full flex items-center justify-center bg-gray-700">
                  <UserIcon class="w-14 h-14 text-gray-400" />
                </div> -->
                        </div>
                        <div
                            class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[#00BD7E] text-white font-bold rounded-full w-8 h-8 flex items-center justify-center">
                            {{ leaderboard[2]?.rank || 3 }}
                        </div>
                    </div>
                    <div class="text-center">
                        <h3 class="text-lg font-semibold">{{ leaderboard[2]?.fullname || 'Player 3' }}</h3>
                        <h2 class="text-md">{{ leaderboard[2]?.idno || 'Player 3' }}</h2>
                        <p class="text-[#00BD7E] font-bold">{{ leaderboard[2]?.points || 0 }} pts</p>
                    </div>
                    <div class="mt-4 w-full h-6 bg-[#313131] rounded-t-lg"></div>
                </div>
            </div>

            <!-- Rest of the Leaderboard -->
            <div class="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-[#313131]">
                        <thead class="bg-[#313131]">
                            <tr>
                                <th scope="col"
                                    class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Rank</th>
                                    <th scope="col"
                                    class="px-6 py-4 pl-30 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    IDNO</th>
                                <th scope="col"
                                    class="px-6 py-4 pl-30 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Student</th>
                                <th scope="col"
                                    class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Points</th>
                            </tr>
                        </thead>
                        <tbody class="bg-[#212121] divide-y divide-[#313131]">
                            <tr v-for="(player, index) in leaderboard.slice(3)" :key="player.idno"
                                class="hover:bg-gray-750 transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="text-gray-300">{{ player.rank }}</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-center">
                                    <span
                                        class="px-2 inline-flex -ml-12.5 text-md leading-5 font-semibold rounded-full bg-opacity-20 text-[#00BD7E]">
                                        {{ player.idno }} 
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div
                                            class="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden border-2 border-[#00BD7E] flex items-center justify-center">
                                            <div :style="{ 'background-image': toBase64(player.poke_icon) }"
                                                class="absolute size-8 rounded-full bg-contain bg-no-repeat bg-bottom bg-[#202020]" />
                                            <!-- <div v-else class="h-full w-full flex items-center justify-center bg-gray-700">
                          <UserIcon class="w-6 h-6 text-gray-400" />
                        </div> -->
                                        </div>
                                        <div class="ml-4">
                                            <div class="text-lg font-medium text-white">{{ player.fullname }}</div>
                                        </div>
                                    </div>
                                </td>
                                
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                        class="px-2 inline-flex text-md leading-5 font-semibold rounded-full bg-opacity-20 text-[#00BD7E]">
                                        {{ player.points }} pts
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { onBeforeMount } from 'vue';
//   import { UserIcon } from '@heroicons/vue/outline';
import AdminNavbar from '@/components/AdminNavbar.vue';
import { getLeaderboard } from '@/api/sitin';
import type { Leaderboard } from '@/types/Leaderboard';
import { toBase64 } from '@/library/base64'; // Assuming you have a utility function to convert to base64
const leaderboard = ref<Leaderboard[]>([]);

onBeforeMount(async () => {
    const response = await getLeaderboard();
    if (response.success) {
        leaderboard.value = response.leaderboard as Leaderboard[];
    } else {
        console.error('Failed to fetch leaderboard:', response.error);
    }
});
// Sample data - replace with your actual leaderboard ref
//   const leaderboard = ref([
//     {
//       rank: 1,
//       idno: 'P001',
//       fullname: 'Ash Ketchum',
//       poke_icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...', // truncated for example
//       points: 2500
//     },
//     {
//       rank: 2,
//       idno: 'P002',
//       fullname: 'Misty Williams',
//       poke_icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...', // truncated for example
//       points: 2300
//     },
//     {
//       rank: 3,
//       idno: 'P003',
//       fullname: 'Brock Harrison',
//       poke_icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...', // truncated for example
//       points: 2100
//     },
//     {
//       rank: 4,
//       idno: 'P004',
//       fullname: 'Gary Oak',
//       poke_icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...', // truncated for example
//       points: 2000
//     },
//     {
//       rank: 5,
//       idno: 'P005',
//       fullname: 'Dawn Berlitz',
//       poke_icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...', // truncated for example
//       points: 1900
//     },
//     // Add more players as needed
//   ]);
</script>

<style>
/* Custom scrollbar */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: #2d3748;
}

::-webkit-scrollbar-thumb {
    background: #00BD7E;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #00a371;
}
</style>