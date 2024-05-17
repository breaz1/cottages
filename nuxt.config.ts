// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      title: "Берег | Строительство в крыму",
      meta: [
        {charset: 'utf-8'},
        {name: 'viewport', content: 'width=device-width, initial-scale=1'},
        { hid: 'description', name: 'description', content: 'Строительная компания «Берег» - строительство в крыму. Большой выбор объектов недвижимости, бесплатный обзор объектов на авто, юридическое сопровождение сделки.' },
        { hid: 'keywords', name: 'keywords', content: 'Строительство, строительство домов, берег, дом на берегу, Ялта, отдых, побережье, море, дом, недвижимость, вилла, коттедж' },
        {
          hid: 'og:image',
          property: 'og:image',
          content: '/assets/img/logo.png',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', type: 'image/png', href: '/apple-touch-icon.png' },
      ],
      script: [
        {
          type: 'application/ld+json',
        }
      ]
    }
  },
  runtimeConfig: {
    public: {
      baseURL: "https://cottages.maxton.studio"
    },
  },
  css: [
    '@/assets/css/main.css',
    '~/assets/css/main.css',
  ],
  yandexMaps: {
    apikey: '9715d01b-4d9a-4324-b7de-12087ac8b9b4',
  },
  modules:[
    '@nuxtjs/device',
    '@pinia/nuxt',
    'vue-yandex-maps/nuxt',
    'vue3-carousel-nuxt',
    '@nuxtjs/robots',
    "@nuxt/image"
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})