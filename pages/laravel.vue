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
