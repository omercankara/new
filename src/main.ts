// import {createApp} from 'vue'

// // App
// import App from './App.vue'




// /* Theme variables */
// import '@/scss/style.scss';

// const app = createApp(App);


// import vue3GoogleLogin from 'vue3-google-login'
// const clientId = "921124018442-3jbcbq76vio4djvtst9iljvs0lnojlih.apps.googleusercontent.com"

// // Ionic
// import {IonicVue} from '@ionic/vue';
// app.use(IonicVue);

// // Pinia
// import {createPinia} from "pinia";
// export const pinia = createPinia()
// app.use(pinia);

// // Google Maps
// // import VueGoogleMaps from '@fawmi/vue-google-maps'
// // app.use(VueGoogleMaps, {
// //     load: {
// //         key: 'AIzaSyDwWL08MSWk__QbN0wgcMCSHNjE_eflzOA',
// //         libraries: 'places',
// //         language: 'tr',
// //     },
// // })

// // https://maps.googleapis.com/maps/api/js?key=AIzaSyDwWL08MSWk__QbN0wgcMCSHNjE_eflzOA&libraries=places&callback=initMap

// // Router
// import router from './router';
// app.use(router);

// router.isReady().then(() => {
//     app.mount('#app');
// });


import { createApp } from 'vue'
import App from './App.vue'
import { IonicVue } from '@ionic/vue'
import { createPinia } from 'pinia'
import router from './router'
import vue3GoogleLogin from 'vue3-google-login'

// Theme variables
import '@/scss/style.scss'

const app = createApp(App)

// Google Login
const clientId = '921124018442-l0abp51oh0imtkr26qmpl7vukrosflo2.apps.googleusercontent.com'
app.use(vue3GoogleLogin, { clientId })

// Ionic
app.use(IonicVue)

// Pinia
export const pinia = createPinia()
app.use(pinia)

// Router
app.use(router)

router.isReady().then(() => {
    app.mount('#app')
})


