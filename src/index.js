import { createApp } from "vue";
import App from './App'
import DevUi from 'vue-devui'

import 'vue-devui/style.css';
import '@devui-design/icons/icomoon/devui-icon.css';
import { ThemeServiceInit, infinityTheme } from 'devui-theme';

ThemeServiceInit({ infinityTheme }, 'infinityTheme');

const app = createApp(App)
app.use(DevUi)
app.mount('#app')