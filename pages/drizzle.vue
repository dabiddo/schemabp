<!-- pages/index.vue -->
<template>
  <div>
    <textarea v-model="jsonLdInput"></textarea>
    <button @click="generateDrizzleCode">Generate Prisma Code</button>
    <pre>{{ drizzleCode }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSchemaBP } from '~/composables/useSchemaBP'

const jsonLdInput = ref('')
const drizzleCode = ref('')

const generateDrizzleCode = () => {
  const parsedJsonLd = JSON.parse(jsonLdInput.value)
  const { toDrizzleCode } = useSchemaBP(parsedJsonLd)
  drizzleCode.value = toDrizzleCode()
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
