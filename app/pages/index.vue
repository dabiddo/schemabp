<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">JSON-LD to X - Converter</h1>
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <table class="w-full border-collapse border-2 border-gray-300">
          <tbody>
            <tr class="hover:bg-gray-50">
              <td class="border-2 border-gray-300 p-4">
                <NuxtLink to="/laravel" class="text-blue-600 hover:text-blue-800 font-medium">
                  Json2Laravel
                </NuxtLink>
              </td>
              <td class="border-2 border-gray-300 p-4">Convert Json / Json-LD to Laravel Migrations & Models</td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="border-2 border-gray-300 p-4">
                <NuxtLink to="/phpdto" class="text-blue-600 hover:text-blue-800 font-medium">
                  Json2PhpDto
                </NuxtLink>
              </td>
              <td class="border-2 border-gray-300 p-4">Convert Json / Json-LD to PHP DTO Class</td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="border-2 border-gray-300 p-4">
                <NuxtLink to="/drizzle" class="text-blue-600 hover:text-blue-800 font-medium">
                  Json2Drizzle
                </NuxtLink>
              </td>
              <td class="border-2 border-gray-300 p-4">Convert Json / Json-LD to Drizzle ORM Schemas</td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="border-2 border-gray-300 p-4">
                <NuxtLink to="/prisma" class="text-blue-600 hover:text-blue-800 font-medium">
                  Json2Prisma
                </NuxtLink>
              </td>
              <td class="border-2 border-gray-300 p-4">Convert Json / Json-LD to Prisma ORM Schemas</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">SQL to X - Converter</h1>
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <table class="w-full border-collapse border-2 border-gray-300">
          <tbody>
            <tr class="hover:bg-gray-50">
              <td class="border-2 border-gray-300 p-4">
                <NuxtLink to="sqllaravel" class="text-blue-600 hover:text-blue-800 font-medium">
                  Sql2Laravel
                </NuxtLink>
              </td>
              <td class="border-2 border-gray-300 p-4">Converts a SQL Table definition to Laravel migration & model</td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer class="text-center text-gray-600 mt-8">
        by <NuxtLink to="https://www.github.com/dabiddo" class="text-blue-600 hover:text-blue-800">Dabiddo</NuxtLink>
      </footer>
    </div>
  </div>
</template>
