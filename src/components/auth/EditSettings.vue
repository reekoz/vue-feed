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
export default {
  data() {
    return {
      error: null,
      valid: false,
      loading: false,
      newName: '',
      nameRules: [v => !!v || 'A name is required'],
    };
  },
  created() {
    this, (this.newName = this.$store.getters.name);
  },
  methods: {
    closeDialog() {
      this.$emit('close-dialog');
    },
    async editSettings() {
      this.loading = true;
      this.error = null;

      try {
        await this.$store.dispatch('updateSettings', {
          name: this.newName,
          themeMode: this.$vuetify.theme.dark ? 'dark' : 'light',
        });
        this.loading = false;
        this.closeDialog();
      } catch (err) {
        this.error = err.message || err;
        this.loading = false;
      }
    },
  },
  computed: {},
};
</script>
