import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: colors.amber.darken3,
        accent: colors.purple.lighten2
      },
      light: {
        primary: colors.teal.darken2,
      },
    },
  },
});
