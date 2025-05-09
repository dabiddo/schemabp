<!-- pages/laravel.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">JSON-LD to Laravel Model / Migration Converter</h1>
      <textarea
        v-model="jsonLdInput"
        class="w-full h-64 p-4 mb-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono resize-none"
        placeholder="Paste your JSON-LD here..."
      ></textarea>
      <button
        @click="generateLaravelCode"
        class="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors mb-8"
      >
        Generate Laravel Code
      </button>
      <div v-for="(code, index) in laravelCode" :key="index" class="mb-8">
        <div class="bg-white rounded-lg shadow-sm p-6 mb-4">
          <h3 class="text-lg font-semibold mb-4 text-gray-800">Model</h3>
          <pre class="bg-gray-50 p-4 rounded-lg overflow-x-auto font-mono text-sm">{{ code.model }}</pre>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-800">Migration</h3>
          <pre class="bg-gray-50 p-4 rounded-lg overflow-x-auto font-mono text-sm">{{ code.migration }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
