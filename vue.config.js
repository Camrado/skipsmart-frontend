const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,

  pwa: {
    name: 'SkipSmart',
    short_name: 'SkipSmart',
    theme_color: '#232946',
    start_url: '.',
    display: 'standalone',
    background_color: '#000000'
  }
});
