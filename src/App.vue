<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item router to="/">
        <v-list-item-content>
          <v-list-item-title class="title">
            <v-icon>mdi-rss</v-icon>
            Feed App
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense nav v-if="!isLoggedIn">
        <v-list-item link router to="/signup">
          <v-list-item-content>
            <v-list-item-title>Signup</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link router to="/login">
          <v-list-item-content>
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list v-else>
        <v-list-item link router to="/feed">
          <v-list-item-content>
            <v-list-item-title>Feed</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title v-show="!drawer">
        <v-icon>mdi-rss</v-icon>
        Feed App
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <span class="mr-2" v-if="isLoggedIn">
        <v-icon>mdi-account</v-icon>
        {{ userName }}
      </span>
      <v-btn icon v-if="isLoggedIn" @click="logout">
        <v-icon>mdi-export</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
      <v-snackbar v-model="showAlert" :color="alertType" top right>
        {{ alertMsg }}
        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="closeErorrAlert">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
    showAlert: false,
  }),
  created() {
    this.$store.dispatch('tryLogin');
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuth;
    },
    userName() {
      return this.$store.getters.name;
    },
    editDialog() {
      return this.$store.getters.editDialog;
    },
    alert() {
      return this.$store.getters.alert;
    },
    alertMsg() {
      return this.$store.getters.alertMsg;
    },
    alertType() {
      return this.$store.getters.alertType;
    },
  },
  watch: {
    isLoggedIn(curValue, oldValue) {
      if (curValue && curValue !== oldValue) {
        this.$router.replace('/feed');
      } else if (!curValue && curValue !== oldValue) {
        this.$router.replace('/login');
      }
    },
    alert(value) {
      this.showAlert = value;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
    },
    closeErorrAlert() {
      this.$store.dispatch('toggleAlert', {
        show: false,
        message: null,
        type: null,
      });
    },
  },
};
</script>
