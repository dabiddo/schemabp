// nuxt.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  css: [
    '~/assets/css/main.css'
  ],
  app: {
    baseURL: '/schemabp/',
    buildAssetsDir: 'assets',
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap',
        }
      ]
    }
  },
  ssr: false,
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
  }
})