// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// Extras
import { es } from "vuetify/locale";

// General Theme
const customTheme = {
  dark: false,
  colors: {
    primary: "#0F828C",
    secondary: "#0F828C",
    accent: "#065084",
    error: "#BF092F",
    info: "#065084",
    success: "#320A6B",
    warning: "#B9A531",
  },
};

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "customTheme",
    themes: {
      customTheme,
    },
  },
  locale: {
    locale: "es",
    messages: { es },
  },
});
