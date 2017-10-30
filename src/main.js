// Ponyfill
import 'es6-object-assign/auto'
import 'es6-promise/auto'

// Import Vue
import Vue from 'vue';

// Import F7
import Framework7 from 'framework7'

// Import F7 Vue Plugin
import Framework7Vue from 'framework7-vue'

// Import F7 iOS Theme Styles
import Framework7Theme from 'framework7/dist/css/framework7.ios.min.css'
import Framework7ThemeColors from 'framework7/dist/css/framework7.ios.colors.min.css'
/* OR for Material Theme:
import Framework7Theme from 'framework7/dist/css/framework7.material.min.css'
import Framework7ThemeColors from 'framework7/dist/css/framework7.material.colors.min.css'
*/

import Framework7Icons from 'framework7-icons/css/framework7-icons.css'
import axios from 'axios'

// Import App Custom Styles
import './assets/fonts/iconfont.css'
import './css/app.css'

// Import Routes
import Routes from './router/index.js'

// Import App Component
import App from './app';

// Import Chat Component
import Chat from './components/Chat';

// Init F7 Vue Plugin
Vue.use(Framework7Vue);

// Import Vuex store
import store from './store'
import { getLoginUser } from './store/actions'

// Init network framework
import './network'

// Import language file
import VueI18n from 'vue-i18n'
import StoreCache from './utils/storeCache'
import enUS from './lang/en_us'
import zhCN from './lang/zh_cn'

let cache = new StoreCache('vuex')
Vue.use(VueI18n)
Vue.config.lang = cache.get('lang') || 'en'
Vue.locale('en', enUS)
Vue.locale('zh', zhCN)
Vue.prototype.$http = axios;
Vue.config.productionTip = false;

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
if (getQueryString('uid')) {
    // Init App
    new Vue({
        el: '#app',
        template: '<Chat/>',
        // Init Framework7 by passing parameters here
        framework7: {
            root: '#app',
            routes: Routes,
            dynamicNavbar: true,
            animateNavBackIcon: true,
            modalTitle: Vue.t('app.modal.title'),
            modalButtonOk: Vue.t('app.modal.button_ok'),
            modalButtonCancel: Vue.t('app.cancel'),
            /* Uncomment to enable Material theme: */
            // material: true,
        },
        // Register App Component
        components: {
            Chat
        }
    });
} else {
    // Init App
    new Vue({
        el: '#app',
        store,
        template: '<App/>',
        // Init Framework7 by passing parameters here
        framework7: {
            root: '#app',
            routes: Routes,
            dynamicNavbar: true,
            animateNavBackIcon: true,
            modalTitle: Vue.t('app.modal.title'),
            modalButtonOk: Vue.t('app.modal.button_ok'),
            modalButtonCancel: Vue.t('app.cancel'),
            /* Uncomment to enable Material theme: */
            // material: true,
        },
        // Register App Component
        components: {
            App
        }
    });
}