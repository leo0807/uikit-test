import "@mdi/font/css/materialdesignicons.css";
import Vue from "vue";
import App from "./App.vue";
import Vuetify from "vuetify/lib";
import UIKit from "./index";
import VueI18n from "vue-i18n";
import messages from "./locales";

Vue.config.performance = true;

Vue.use(Vuetify);
Vue.use(UIKit);
Vue.use(VueI18n);

const vuetify = new Vuetify(UIKit.preset);

Vue.use(UIKit.Toast, vuetify, { top: false, centered: true });
Vue.use(UIKit.Dialog, vuetify, { flat: true });

const i18n = new VueI18n({
  locale: "en",
  fallbackLocale: "en",
  messages
});

new Vue({
  vuetify,
  i18n,
  render(h) {
    return h(App);
  }
}).$mount("#app");
