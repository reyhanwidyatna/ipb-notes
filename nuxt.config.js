export default {
  target: 'static',

  ssr: false,

  head: {
    title: 'IPB Notes',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/logo.png' }],
  },

  css: [],

  plugins: [
    { src: '~/plugins/vue-draggable.js', ssr: false },
    { src: '~/plugins/vue-modal.js', ssr: false },
    { src: '~/plugins/vue-toast.js', ssr: false },
    { src: '~/plugins/vue-persist.js', ssr: false }
  ],

  components: true,

  buildModules: [
    '@nuxtjs/eslint-module',
  ],

  modules: [],

  build: {},
}
