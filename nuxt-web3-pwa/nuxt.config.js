export default {
  ssr: false,
  generate: {
    dir: "public"
  }, 
  env: { //ここから追加
    APIKEY: process.env.APIKEY,
    AUTHDOMAIN: process.env.AUTHDOMAIN,
    PRIVATE: process.env.PRIVATE || "http://localhost:8545" //←ここを追加
  },
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'nuxt-web3-pwa',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '~/plugins/web3.js', mode: 'client' }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/pwa'　//←これを追加
  ],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  },
  manifest: {
    name: "nuxt-web3-pwa",
    title: "nuxt-web3-pwa",
    'og:title': 'nuxt-web3-pwa',
    description: 'nuxt-web3-pwaのDescription',
    'og:description': 'nuxt-web3-pwaのDescription',
    lang: 'ja',
    theme_color: "#41b883",
    background_color: "#ffffff",
    display: "standalone",
    scope: "/",
    start_url: "/"
  }
}
