<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">JSON-LD to Prisma Schema Converter</h1>
      </div>
      <div class="bg-white shadow rounded-lg p-6">
        <textarea
          v-model="jsonLdInput"
          class="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 mb-4"
          placeholder="Paste your JSON-LD here..."
        ></textarea>
        <button
          @click="generatePrismaCode"
          class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-4"
        >
          Generate Prisma Code
        </button>
        <pre v-if="prismaCode" class="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-auto">{{ prismaCode }}</pre>
      </div>
    </div>
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
