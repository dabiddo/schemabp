<!-- pages/index.vue -->
<template>
  <div>
    <textarea v-model="jsonLdInput"></textarea>
    <button @click="generateLaravelCode">Generate Laravel Code</button>
    <pre>{{ laravelCode }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSchemaBP } from '~/composables/useSchemaBP'

const jsonLdInput = ref('')
const laravelCode = ref('')

const generateLaravelCode = () => {
  const parsedJsonLd = JSON.parse(jsonLdInput.value)
  const { toLaravelCode } = useSchemaBP(parsedJsonLd)
  laravelCode.value = toLaravelCode()
}
</script>
<style scoped>
textarea {
  width: 100%;
  height: 200px;
  margin-bottom: 10px;
}

pre {
  background: #f4f4f4;
  padding: 10px;
  border: 1px solid #ddd;
}
</style>
