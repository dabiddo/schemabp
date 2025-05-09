<script setup lang="ts">
import { ref } from 'vue';
import { useSchemaBP } from '~/composables/useSchemaBP'

interface ModelOutput {
  model: string;
  migration: string;
}

const sqlCreateTable = ref('');
const laravelCode = ref<ModelOutput[]>([]);

const generateLaravelCode = () => {
  const { sqlToLaravelCode } = useSchemaBP(sqlCreateTable.value);
  laravelCode.value = sqlToLaravelCode();
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">SQL to Laravel Converter</h1>

      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Input SQL</h2>
        <textarea
          v-model="sqlCreateTable"
          placeholder="Enter CREATE TABLE SQL here"
          rows="8"
          class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
        ></textarea>

        <button
          @click="generateLaravelCode"
          class="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Generate Laravel Migration and Model
        </button>
      </div>

      <div v-if="laravelCode.length > 0" class="space-y-6">
        <h2 class="text-xl font-semibold text-gray-800">Generated Code</h2>
        <div v-for="(code, index) in laravelCode" :key="index" class="space-y-4">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-800 mb-3">Model</h3>
            <pre class="bg-gray-50 p-4 rounded-md overflow-x-auto"><code>{{ code.model }}</code></pre>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-800 mb-3">Migration</h3>
            <pre class="bg-gray-50 p-4 rounded-md overflow-x-auto"><code>{{ code.migration }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
