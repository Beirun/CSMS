<script setup lang="ts">
import { RouterLink } from 'vue-router'

</script>

<template>
    <div class="flex absolute justify-between w-screen items-center py-4 px-8">
       <div><img src="@/assets/logo.png" alt="Logo" class="h-20 w-20    "></div>
       <div class="flex gap-4 text-lg font-semibold">
        <RouterLink class="w-25 py-2 px-2 font-bold cursor-pointer text-[#00BD7E]/65 hover:text-[#00BD7E] rounded flex item-center justify-center transition-colors duration-400" to="/login">Login</RouterLink>
        <RouterLink class="w-25 py-2 px-2 cursor-pointer bg-[#00BD7E] hover:bg-[#00BD7E]/65 text-white rounded flex item-center justify-center transition-colors duration-400" to="/register">Register</RouterLink>
       </div>
    </div>
</template>