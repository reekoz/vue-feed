<template>
  <v-form v-model="valid" @submit.prevent="editSettings">
    <v-card :loading="loading">
      <v-card-title>
        <span class="headline">Edit Settings</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-text-field
              label="Name"
              v-model="newName"
              :rules="nameRules"
            ></v-text-field>
          </v-row>
          <v-row>
            <v-switch v-model="$vuetify.theme.dark" inset persistent-hint>
              <template v-slot:label>
                Theme mode:
                <strong class="ml-2">{{
                  $vuetify.theme.dark ? 'Dark' : 'Light'
                }}</strong>
              </template>
            </v-switch>
          </v-row>
          <v-row>
            <span class="subheading">
              Theme color:
              <strong
                >{{ userColor }}
                {{ userShade ? '(' + userShade + ')' : '' }}</strong
              >
            </span>
            <v-chip-group v-model="userColor" mandatory column>
              <v-chip
                v-for="color in allColors"
                :key="color"
                :value="color"
                :class="toKebabCase(color)"
                @click="setColor(color, userShade)"
              >
                {{ toKebabCase(color) }}
              </v-chip>
            </v-chip-group>
            <v-chip-group v-model="userShade" column>
              <v-chip value="darken1">Darken 1</v-chip>
              <v-chip value="darken2">Darken 2</v-chip>
              <v-chip value="darken3">Darken 3</v-chip>
              <v-chip value="darken4">Darken 4</v-chip>
              <v-chip value="lighten1">Lighten 1</v-chip>
              <v-chip value="lighten2">Lighten 2</v-chip>
              <v-chip value="lighten3">Lighten 3</v-chip>
              <v-chip value="lighten4">Lighten 4</v-chip>
            </v-chip-group>
          </v-row>
          <v-row>
            <v-alert
              type="error"
              v-show="error"
              dense
              text
              class="mx-auto mt-1"
            >
              {{ error }}
            </v-alert>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialog">
          Close
        </v-btn>
        <v-btn color="primary" text @click="editSettings" :disabled="!valid">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import colors from 'vuetify/lib/util/colors';

export default {
  data() {
    return {
      error: null,
      valid: false,
      loading: false,
      newName: '',
      nameRules: [v => !!v || 'A name is required'],
      allColors: [],
      userColor: '',
      userShade: null,
    };
  },
  created() {
    this.newName = this.$store.getters['auth/name'];
    for (var color in colors) {
      if (color !== 'shades') this.allColors.push(color);
    }
    this.userColor = this.color;
    this.userShade = this.shade;
  },
  methods: {
    closeDialog() {
      this.$emit('close-dialog');
    },
    async editSettings() {
      this.loading = true;
      this.error = null;

      try {
        await this.$store.dispatch('auth/updateSettings', {
          name: this.newName,
          themeMode: this.$vuetify.theme.dark ? 'dark' : 'light',
          color: this.userColor,
          shade: this.userShade || null,
        });
        this.loading = false;
        this.closeDialog();
      } catch (err) {
        this.error = err.message || err;
        this.loading = false;
      }
    },
    toKebabCase(str) {
      return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/\s+/g, '-')
        .toLowerCase();
    },
    setColor(color, shade) {
      if (this.$vuetify.theme.dark) {
        this.$vuetify.theme.themes.dark.primary = shade
          ? colors[color][shade]
          : colors[color];
      } else {
        this.$vuetify.theme.themes.light.primary = shade
          ? colors[color][shade]
          : colors[color];
      }
    },
  },
  computed: {
    colors() {
      return colors;
    },
    color() {
      return this.$store.getters['auth/color'];
    },
    shade() {
      return this.$store.getters['auth/shade'];
    },
  },
  watch: {
    userShade(value) {
      this.setColor(this.userColor, value);
    },
  },
};
</script>
