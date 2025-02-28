<script setup lang="ts">
import { ref } from 'vue';

const model = defineModel()
const props = withDefaults(
  defineProps<{
    placeholder?: string;
    type?: string;
    class?: string;
    editable?: boolean;
    keyPress?: () => void;
  }>(),
  {
    editable: true, // Default value for 'editable'
  }
);
</script>
<template>
  <div :class="props.class" class="relative" >
    <input
      v-model="model"
      @keyup.enter="keyPress"
      :type="type"
      :placeholder="placeholder"
      :class="{ 'pointer-events-none': !editable }"
      class="px-2 text-[#f8f8f8] placeholder:text-[#8e8e8e] peer w-full py-2 bg-transparent border-b-2 border-[#3e3e3e] focus:outline-none focus:border-transparent transition-all duration-300"
    >
    <div
      class="absolute bottom-0 left-0 w-full h-[1px] border-b-2 bg-transparent border-[#00BD7E] scale-x-0 transition-transform duration-300 peer-focus:scale-x-100 origin-center"
    ></div>
  </div>
</template>