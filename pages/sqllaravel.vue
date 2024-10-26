<script setup>
import { ref } from 'vue';
import { useSchemaBP } from '~/composables/useSchemaBP'

const sqlCreateTable = ref('');
const laravelCode = ref([]);

// Function to generate Laravel code
const generateLaravelCode = () => {
  const { sqlToLaravelCode } = useSchemaBP(sqlCreateTable.value);
  laravelCode.value = sqlToLaravelCode();
};
</script>

<template>
  <div>
    <!-- No `.value` needed on `v-model` for refs -->
    <textarea v-model="sqlCreateTable" placeholder="Enter CREATE TABLE SQL here"></textarea>
    <button @click="generateLaravelCode">Generate Laravel Migration and Model</button>
    <div v-for="(code, index) in laravelCode" :key="index">
      <pre>{{ code.model }}</pre>
      <pre>{{ code.migration }}</pre>
    </div>
  </div>
</template>

<style scoped>
textarea {
  width: 100%;
  height: 100px;
}
button {
  margin: 10px 0;
}
pre {
  background-color: #f3f3f3;
  padding: 10px;
  border-radius: 4px;
}
</style>
