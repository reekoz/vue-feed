<template>
  <section>
    <v-form v-model="valid" @submit.prevent="signup">
      <v-card
        outlined
        shaped
        class="mx-auto"
        max-width="400"
        :loading="loading"
      >
        <v-card-title>Signup</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-text-field
                type="email"
                label="E-mail"
                v-model="email"
                :rules="emailRules"
              ></v-text-field>
            </v-row>
            <v-row>
              <v-text-field
                type="text"
                label="Name"
                v-model="name"
                :rules="nameRules"
              ></v-text-field>
            </v-row>
            <v-row>
              <v-text-field
                type="password"
                label="Password"
                v-model="password"
                :rules="passwordRules"
              ></v-text-field>
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
          <v-btn
            color="primary"
            :disabled="!valid"
            type="submit"
            :loading="loading"
          >
            Signup
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </section>
</template>

<script>
export default {
  data: () => ({
    error: null,
    valid: false,
    name: '',
    nameRules: [v => !!v || 'Name is required'],
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+/.test(v) || 'E-mail must be valid',
    ],
    password: '',
    passwordRules: [
      v => !!v || 'Password is required',
      v => v.length > 4 || 'Password must be at least 5 characters',
    ],
    loading: false,
  }),
  methods: {
    async signup() {
      this.loading = true;
      this.error = null;

      try {
        await this.$store.dispatch('auth/signup', {
          email: this.email,
          password: this.password,
          name: this.name,
        });
        this.$router.replace('/login');
      } catch (err) {
        this.error = err.message || err;
        this.loading = false;
      }
    },
  },
};
</script>
