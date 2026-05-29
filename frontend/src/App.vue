<script setup>
import NavBar from '@/components/layout/NavBar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>

<template>
  <div class="page-wrapper">
    <NavBar />
    <RouterView />
    <AppFooter />
  </div>
</template>
