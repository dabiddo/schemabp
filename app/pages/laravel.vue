<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">
        JSON-LD to Laravel (Migrations & Models) Converter
      </h1>

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

      <div v-if="laravelOutputs.length > 0">
        <div
          v-for="output in laravelOutputs"
          :key="output.name"
          class="space-y-6 mb-12"
        >
          <h2 class="text-2xl font-bold text-gray-700 border-b pb-2">
            {{ output.name }} (Laravel)
          </h2>

          <div class="relative group">
            <button
              @click="copyToClipboard(output.model)"
              class="absolute top-2 right-2 p-2 bg-gray-200 hover:bg-gray-300 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              title="Copy Model"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
            <div
              class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500"
            >
              <h3 class="text-sm font-bold uppercase text-gray-500 mb-2">
                Eloquent Model
              </h3>
              <pre
                class="bg-gray-50 p-4 rounded font-mono text-xs overflow-x-auto"
                >{{ output.model }}</pre
              >
            </div>
          </div>

          <div class="relative group">
            <button
              @click="copyToClipboard(output.migration)"
              class="absolute top-2 right-2 p-2 bg-gray-200 hover:bg-gray-300 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              title="Copy Migration"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
            <div
              class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500"
            >
              <h3 class="text-sm font-bold uppercase text-gray-500 mb-2">
                Migration
              </h3>
              <pre
                class="bg-gray-50 p-4 rounded font-mono text-xs overflow-x-auto"
                >{{ output.migration }}</pre
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ModelOutput } from "~/types";

const { getGenerators } = useSchemaBP();
const jsonLdInput = ref("");

// Reactive refs
const laravelOutputs = ref<ModelOutput[]>([]);

const generateLaravelCode = () => {
  try {
    const generators = getGenerators(jsonLdInput.value);
    // Clear previous results
    laravelOutputs.value = [];
    // Store the structured objects here
    laravelOutputs.value = generators.toLaravelCode();
  } catch (e) {
    alert("Parsing failed: " + e.message);
  }
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    // Optional: Add a "Copied!" toast or alert here
    alert("Copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy!", err);
  }
};
</script>
