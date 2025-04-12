<!-- pages/index.vue -->
<template>
  <div>
    <textarea v-model="jsonLdInput" rows="10" cols="90"></textarea>
    <button @click="generateLaravelCode">Generate Laravel Code</button>
    <div v-for="(code, index) in laravelCode" :key="index">
      <pre>{{ code.model }}</pre>
      <pre>{{ code.migration }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSchemaBP } from '~/composables/useSchemaBP'

const jsonLdInput = ref('')
const laravelCode = ref([])

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
