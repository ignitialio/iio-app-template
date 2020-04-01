import './registerServiceWorker'

import Vue from 'vue'
import vuetify from '@/plugins/vuetify.plugin'

import { sync } from 'vuex-router-sync'

import './main.css'
import 'typeface-roboto'
import 'material-design-icons/iconfont/material-icons.css'
import 'vuetify/dist/vuetify.min.css'

import App from './components/App.vue'
import { getRouter } from './router'
import { getStore } from './store'

// Vue plugins
import wsPlugin from './plugins/ws.plugin'
import servicesPlugin from './plugins/services.plugin'
import modulesPlugin from './plugins/modules.plugin'
import i18nPlugin from './plugins/i18n.plugin'
import configPlugin from './plugins/config.plugin'
import utilsPlugin from './plugins/utils.plugin'
import encodersPlugin from './plugins/encoders.plugin'
import uiPlugin from './plugins/ui.plugin'
import dbPlugin from './plugins/db.plugin'
import helpersPlugin from './plugins/helpers.plugin'

// -----------------------------------------------------------------------------
// Specific imports

import storeModule from './store/store.module'

// -----------------------------------------------------------------------------

// Vue configuration
Vue.config.productionTip = false

// get instances
let router = getRouter(Vue)
let store = getStore(Vue)

// -----------------------------------------------------------------------------
// Specific store
store.registerModule('iioat', storeModule)
// -----------------------------------------------------------------------------

// router sync
sync(store, router)

// Vue plugins use
Vue.use(utilsPlugin)
Vue.use(wsPlugin)
Vue.use(servicesPlugin)
Vue.use(modulesPlugin)
Vue.use(i18nPlugin)
Vue.use(configPlugin)
Vue.use(encodersPlugin)
Vue.use(uiPlugin)
Vue.use(dbPlugin)
Vue.use(helpersPlugin)

// initialize components
// ...

// waiting for asyncrounous plugins to be ready (here i18n)
Vue.prototype.$utils
  .waitForProperties(Vue.prototype, [ '$i18n', '$config' ]).then(async () => {
    // create app
    const app = new Vue({
      vuetify,
      router,
      store,
      ...App
    })

    app.$services.waitForService(app.$config.auth.service).then(async authService => {
      try {
        if (localStorage.getItem('token')) {
          let user = await authService.authenticate(localStorage.getItem('token'))
          // console.log('authenticated', user)
          app.$store.commit('user', user)
        } else {
          app.$ws.resetLocalCredentials()
          app.$store.commit('user', null)
          /* NOT AN APP
          if (app.$router.currentRoute.path !== '/login') {
            app.$router.push('/login')
          }
          */
        }
      } catch (err) {
        console.log('failed to authenticate', err)
        app.$ws.resetLocalCredentials()
        app.$store.commit('user', null)

        setTimeout(() => {
          if (app.$router.currentRoute.path !== '/login') {
            app.$router.push('/login')
          }
        }, 100)
      }
    })

    // manage splashscreen
    let splashScreen = document.getElementById('splashScreen')
    splashScreen.style.opacity = 0

    setTimeout(() => {
      splashScreen.parentNode.removeChild(splashScreen)
    }, 1000)

    app.$mount('#app')
  }).catch(err => console.log(err))
