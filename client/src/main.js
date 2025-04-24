import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import CoreuiVue from '@coreui/vue';
import '@coreui/coreui/dist/css/coreui.min.css';
import '@/assets/styles.scss';

createApp(App)
.use(router)
.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
})
.use(ToastService)
.use(ConfirmationService)
.use(CoreuiVue)
.mount('#app');
