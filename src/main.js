import 'primeicons/primeicons.css'
import '@fontsource/inter/400.css'
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import 'primeicons/primeicons.css'
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from './firebase_conf'
import { getCurrentUser } from 'vuefire'

const app = createApp(App);

app.use(VueFire, {
  firebaseApp,
  modules: [
    // we will see other modules later on
    VueFireAuth(),
  ],
})

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
        darkModeSelector: 'none',
    }
  },
});




router.beforeEach(async (to) => {
  // routes with `meta: { requiresAuth: true }` will check for
  // the users, others won't
  if (to.meta.requiresAuth) {
    const currentUser = await getCurrentUser()
    // if the user is not logged in, redirect to the login page
    if (!currentUser) {
      return {
        path: '/login',
        query: {
          redirect: to.fullPath,
        },
      }
    }
  }
  if (to.meta.loggedIn) {
    const currentUser = await getCurrentUser()
    if (currentUser) {
      return {
        path: '/',
        query: {
          redirect: to.fullPath,
        },
      }
    }
  }
})

app.use(router);

app.mount("#app");
