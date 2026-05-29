<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <main class="view-placeholder">
    <h1>Annonce #{{ route.params.id }}</h1>
    <p>Page en cours de développement.</p>
  </main>
</template>
