module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pwa: {
    name: 'Feed App',
    themeColor: '#ff8f00',
    msTileColor: '#ff8f00',
    manifestPath: 'manifest.json',
    workboxOptions: {
      exclude: [/\.map$/, /_redirects/] //this fixed it.
    }
  }
}