<!-- pages/index.vue -->
<template>
  <div>
    <textarea v-model="jsonLdInput" rows="10" cols="90"></textarea>
    <button @click="generatePrismaCode">Generate Prisma Code</button>
    <pre>{{ prismaCode }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSchemaBP } from '~/composables/useSchemaBP'

const jsonLdInput = ref('')
const prismaCode = ref('')

const generatePrismaCode = () => {
  const parsedJsonLd = JSON.parse(jsonLdInput.value)
  const { toPrismaCode } = useSchemaBP(parsedJsonLd)
  prismaCode.value = toPrismaCode()
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
