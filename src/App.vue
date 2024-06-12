<script setup>
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

const userData = ref(null);

onBeforeMount(() => {
  router.push({ name: 'login' })
})
</script>

<template>
  <div class="vh-100">
    <router-view/>
  </div>
</template>