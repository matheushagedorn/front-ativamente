import { createApp } from "vue";
import App from "./App.vue";
import router from './router';

import "bootstrap/dist/css/bootstrap.css";

import "bootstrap/dist/js/bootstrap.js";

import 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss';

const app = createApp(App)

app.use(router)
app.mount('#app')