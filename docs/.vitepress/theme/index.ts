import DefaultTheme from 'vitepress/theme';
import DeveloperConsole from './components/DeveloperConsole.vue';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DeveloperConsole', DeveloperConsole);
  }
};
