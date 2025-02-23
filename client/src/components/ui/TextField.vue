<script setup lang="ts">
import { defineProps } from 'vue'
const model = defineModel()
defineProps<{ 
    placeholder?: string,
    type?: string, 
    class?: string,
    keyPress?: () => void
    }>()
</script>
<template>
  <div class="relative" :class="class" >
    <input
      v-model="model"
      @keyup.enter="keyPress"
      :type="type"
      :placeholder="placeholder"
      class="px-2 text-[#f8f8f8] placeholder:text-[#8e8e8e] peer w-full py-2 bg-transparent border-b-2 border-[#3e3e3e] focus:outline-none focus:border-transparent transition-all duration-300"
    >
    <div
      class="absolute bottom-0 left-0 w-full h-[1px] border-b-2 bg-transparent border-[#00BD7E] scale-x-0 transition-transform duration-300 peer-focus:scale-x-100 origin-center"
    ></div>
  </div>
</template>
