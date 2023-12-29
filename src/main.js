import { createApp } from "vue";
import App from "./App.vue";
// plugins
import router from "./router";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
// v-wave 
import VWave from "v-wave";

// initializers
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const vue_app = createApp(App);
vue_app.use(router);
vue_app.use(pinia);
vue_app.use(VWave);

vue_app.mount("#app");
