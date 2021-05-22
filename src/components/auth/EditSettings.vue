<template>
  <v-form v-model="valid" @submit.prevent="editSettings">
    <v-card>
      <v-card-title>
        <span class="headline">Edit Settings</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-switch
              v-model="$vuetify.theme.dark"
              inset
              persistent-hint
            >
              <template v-slot:label>
                Theme mode:
                <strong class="ml-2">{{ $vuetify.theme.dark ? 'Dark' : 'Light' }}</strong>
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
      newTitle: '',
      titleRules: [
        v => !!v || 'A title is required',
        v => v.length > 4 || 'Title must be at least 5 characters',
      ],
    };
  },
  methods: {
    closeDialog() {
      this.$emit('close-dialog');
    },
    editSettings() {},
  },
};
</script>
