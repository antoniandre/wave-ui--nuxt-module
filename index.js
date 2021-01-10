import path from 'path'

export default function WaveUIModule(moduleOptions) {
  if (!this.options.components) {
    this.options.components = { dirs: [] }
  }

  this.requireModule('@nuxt/components')

  this.nuxt.hook('build:before', () => {
    const options = {
      ...moduleOptions,
      ...this.options.WaveUI
    }

    // Import wave-ui SCSS.
    // this.options.css.push('wave-ui/dist/wave-ui.css')
    // this.options.css.push(path.resolve(__dirname, '../wave-ui/src/wave-ui/scss/index.scss'))

    // Inject global SCSS variables in all the wave-ui components.
    const { scss } = this.options.build.loaders
    const scssVarsPath = path.resolve(__dirname, '../wave-ui/src/wave-ui/scss/_variables.scss')
    scss.additionalData = [
      scss.additionalData,
      `@import '${this.options.WaveUI.scssVariables}';`,
      `@import '${scssVarsPath}';`
    ].join('\n')

    this.options.build.transpile.push('wave-ui')

    // Register plugin.
    this.addPlugin({
        src: path.resolve(__dirname, 'templates', 'plugin.ejs'),
        fileName: 'wave-ui.js',
        options
    })

    this.nuxt.hook('components:dirs', dirs => {
      dirs.push({
        path: path.resolve(__dirname, '../../wave-ui/src/wave-ui/components'),
        pattern: '**/*.vue',
        transpile: true
      })
    })
  })
}

module.exports.meta = require('./package.json')
