<!-- pages/index.vue -->
<template>
  <div>
    <textarea v-model="jsonLdInput" rows="10" cols="90"></textarea>
    <button @click="generatePhpDtoCode">Generate PHP DTO Code</button>
    <!--<div v-for="(code, index) in phpDto" :key="index">
      <pre>{{ code.model }}</pre>
    </div> -->
    <div v-for="(code, index) in phpDto" :key="index">
      <pre>{{ code }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSchemaBP } from '~/composables/useSchemaBP'

const jsonLdInput = ref('')
const phpDto = ref([])

const generatePhpDtoCode = () => {
  const parsedJsonLd = JSON.parse(jsonLdInput.value)
  const { toPhpDtoCode } = useSchemaBP(parsedJsonLd)
  phpDto.value = toPhpDtoCode()
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
