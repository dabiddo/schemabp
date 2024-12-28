<template>
  <div>
    <h1>JSON-LD to X - Converter</h1>
    <table border="2" bg="#efefef">
      <tbody>
        <tr>
          <td>
            <NuxtLink to="/laravel">
              Json2Laravel
            </NuxtLink>
          </td>
          <td>Convert Json / Json-LD to Laravel Migrations & Models</td>
        </tr>
        <tr>
          <td>
            <NuxtLink to="/phpdto">
              Json2PhpDto
            </NuxtLink>
          </td>
          <td>Convert Json / Json-LD to PHP DTO Class</td>
        </tr>
        <tr>
          <td>
            <NuxtLink to="/drizzle">
              Json2Drizzle
            </NuxtLink>
          </td>
          <td>Convert Json / Json-LD to Drizzle ORM Schemas</td>
        </tr>
        <tr>
          <td>
            <NuxtLink to="/prisma">
              Json2Prisma
            </NuxtLink>
          </td>
          <td>Convert Json / Json-LD to Prisma ORM Schemas</td>
        </tr>
      </tbody>
    </table>
    <h1>Sql 2 X - Converter</h1>
    <table border="2" bg="#efefef">
      <tbody>
        <tr>
          <td>
            <NuxtLink to="sqllaravel">Sql2Laravel</NuxtLink>
          </td>
          <td>Converts a Sql Table definition to Laravel migration & model</td>
        </tr>
      </tbody>
    </table>
    <footer style="padding-top: 4px;">
      by <nuxtLink to="https://www.github.com/dabiddo">Dabiddo</nuxtLink>
    </footer>
  </div>
</template>
