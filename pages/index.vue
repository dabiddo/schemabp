<template>
  <div>
    <h1>JSON-LD to Laravel Converter</h1>
    <form @submit.prevent="onSubmit">
      <textarea v-model="jsonLd" placeholder="Enter JSON-LD schema here" required></textarea>
      <button type="submit" @click="onSubmit">Generate Laravel Code</button>
    </form>
    <div v-if="laravelCode">
      <h2>Generated Laravel Code</h2>
      <pre>{{ laravelCode }}</pre>
    </div>
    <!-- Temporarily display jsonLd to check reactivity -->
    <pre>jsonLd: {{ jsonLd }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Function to convert strings to snake_case
const toSnakeCase = (str) => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_/, '')
}

// Function to convert strings to PascalCase
const toPascalCase = (str) => {
  return str.replace(/(?:^|_)(\w)/g, (_, c) => c.toUpperCase())
}

const jsonLd = ref('')
const laravelCode = ref('')

const onSubmit = async () => {
  try {
    const parsedJsonLd = JSON.parse(jsonLd.value)
    laravelCode.value = generateLaravelCode(parsedJsonLd)
  } catch (error) {
    console.error('Error generating Laravel code:', error)
  }
}

// Recursive function to parse JSON-LD and generate Laravel migration/model schema
const parseJsonLd = (jsonLd, parent = null) => {
  const models = new Map()

  const parseNode = (node, parentName) => {
    if (typeof node === 'object' && !Array.isArray(node)) {
      const nodeType = node['@type']
      if (nodeType) {
        const modelName = toSnakeCase(nodeType) // Convert model name to snake_case for table
        if (parentName) {
          if (!models.has(parentName)) models.set(parentName, [])
          models.get(parentName).push(`$table->foreignId("${toSnakeCase(nodeType)}_id")->constrained()->onDelete("cascade");`)
        }
        if (!models.has(modelName)) models.set(modelName, [])
        Object.keys(node).forEach(key => {
          if (key !== '@type') {
            const snakeCaseKey = toSnakeCase(key)  // Convert field to snake_case
            models.get(modelName).push(`$table->string("${snakeCaseKey}");`)
            parseNode(node[key], modelName)
          }
        })
      } else if (parentName) {
        if (!models.has(parentName)) models.set(parentName, [])
        Object.keys(node).forEach(key => {
          const snakeCaseKey = toSnakeCase(key)  // Convert field to snake_case
          models.get(parentName).push(`$table->string("${snakeCaseKey}");`)
          parseNode(node[key], parentName)
        })
      }
    } else if (Array.isArray(node)) {
      node.forEach(item => parseNode(item, parentName))
    }
  }

  parseNode(jsonLd, parent)
  return models
}

// Function to generate Laravel migration/model code
const generateLaravelCode = (jsonLdSchema) => {
  const models = parseJsonLd(jsonLdSchema)
  let generatedCode = ''

  for (const [model, fields] of models.entries()) {
    const pascalCaseModel = toPascalCase(model) // Convert model to PascalCase

    const modelClass = `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;

class ${pascalCaseModel} extends Model
{
    use HasFactory;
    
    protected $fillable = [
        ${fields.filter(field => field.startsWith('$table->string')).map(field => `"${field.split('"')[1]}"`).join(', ')}
    ];
}
`

    const migrationClass = `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

class Create${pascalCaseModel}sTable extends Migration
{
    public function up()
    {
        Schema::create('${toSnakeCase(model)}s', function (Blueprint $table) {
            $table->id();
            ${fields.join('\n            ')}
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('${toSnakeCase(model)}s');
    }
}
`

    generatedCode += `${modelClass}\n${migrationClass}\n`
  }

  return generatedCode
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