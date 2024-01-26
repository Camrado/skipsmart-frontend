const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,

  pwa: {
    name: 'SkipSmart',
    short_name: 'SkipSmart',
    theme_color: '#232946',
    icons: [
      { src: './img/icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: './img/icons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      { src: './img/icons/android-chrome-maskable-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: './img/icons/android-chrome-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ],
    start_url: '.',
    display: 'standalone',
    background_color: '#000000'
  }
});
