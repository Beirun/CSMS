<script setup lang="ts">
import { computed, ref } from 'vue';
import { toBase64 } from '@/library/base64';
import { setDate } from '@/library/date';

const props = defineProps({
    currentSitin: {
        type: Object,
        required: true
    }
})
const pokeIconStyle = computed(() => ({
    backgroundImage: toBase64(props.currentSitin.poke_icon),
}));


</script>

<template>
    <div class="h-100 w-70 flex flex-col items-center justify-end hover:scale-105 hover:-translate-y-3 transition-all duration-300 cursor-pointer ">
        <div class="rounded-md flex flex-col items-center bg-[#2e2e2e] h-87.5 w-full shadow-lg transition-all duration-300 shadow-black hover:shadow-md hover:shadow-[#00BD7E]/30">
            <div v-bind:style="pokeIconStyle" class="shadow-md shadow-black/50 -mt-12.5 size-35 bg-center bg-contain bg-[#252525] border-4 border-[#1d1d1d] rounded-full"></div>
            <div class="text-2xl p-2 text-[#00BD7E] font-semibold flex items-center">{{currentSitin.idno}} </div>
            <div class="w-[80%] h-[4px] bg-[#1f1f1f] "></div>
            <div class="flex flex-row w-[77.5%] justify-center py-1.5">
                <p class="text-md font-semibold ">{{ currentSitin.firstname }} {{ currentSitin.middlename }} {{ currentSitin.lastname }}</p>
            </div>
            <div class="w-[80%] h-[4px] bg-[#1f1f1f]"></div>
            
            <div class="flex flex-row w-[77.5%] justify-between my-1.5">
                <p>{{ currentSitin.yearlevel }} - {{ currentSitin.course }}</p>
            </div>
            <div class="flex flex-row w-[77.5%] justify-between my-1.5">
                <p>Lab {{ currentSitin.sitin_laboratory }}</p>
            </div>
            <div class="flex flex-row w-[77.5%] justify-between my-1.5">
                <p>{{ currentSitin.sitin_purpose }}</p>
            </div>
            <div class="flex flex-row w-[77.5%] justify-between my-1.5">
                <p>{{ setDate(currentSitin.sitin_timein) }}</p>
            </div>
        </div>
    </div>
</template>