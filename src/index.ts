import { extend } from './utils'
import Component from './component.vue'
import directive from './directive'
import Viewer from 'viewerjs'
import { App } from 'vue-demi'

const plugin = {
  install(app: App, { name = 'viewer', debug = false, defaultOptions = {} } = {}) {
    Viewer.setDefaults(defaultOptions)

    app.component(name, extend(Component, { name }))
    app.use(directive, { name, debug })
  },
  setDefaults(defaultOptions = {}) {
    Viewer.setDefaults(defaultOptions)
  }
}
export default plugin;