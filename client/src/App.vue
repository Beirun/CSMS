<script setup lang="ts">
import { RouterView } from 'vue-router'
import {Toaster, toast} from 'vue-sonner'
import 'remixicon/fonts/remixicon.css'
</script>

<template>
  <Toaster richColors theme="dark"/>
  <RouterView />
</template>


