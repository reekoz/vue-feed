<template>
  <v-container>
    <v-dialog v-model="editDialog" persistent max-width="400">
      <edit-post></edit-post>
    </v-dialog>
    <v-row v-if="loading" justify="center">
      <v-skeleton-loader
        v-for="n in 6"
        :key="n"
        class="mx-auto ml-1 mr-1"
        width="400"
        type="card"
      ></v-skeleton-loader>
    </v-row>
    <v-row justify="center">
      <v-col lg="1" md="3" sm="4" xs="12">
        <v-btn color="primary" block @click.stop="addPost">
          New Post
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="!loading && posts && posts.length > 0" class="post-list">
      <feed-post v-for="p in posts" :key="p._id" :post="p"></feed-post>
    </v-row>
    <v-row
      v-if="!loading && posts && posts.length === 0"
      justify="center"
      class="mt-5"
    >
      <h1>No posts found 🤷🤷‍♂️</h1>
    </v-row>
    <v-snackbar v-model="showErrorAlert" color="error" top right>
      {{ errorMsg }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="closeErorrAlert">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import FeedPost from '../../components/feed/FeedPost.vue';
import EditPost from '../../components/feed/EditPost.vue';

export default {
  components: { FeedPost, EditPost },
  data() {
    return {
      loading: false,
      error: null,
      addDialog: false,
      openDialog: false,
      showErrorAlert: false,
    };
  },
  created() {
    this.loadPosts();
  },
  methods: {
    async loadPosts() {
      this.loading = true;
      this.error = null;

      try {
        await this.$store.dispatch('loadPosts');
      } catch (err) {
        this.error = err.message || err;
      }

      this.loading = false;
    },
    addPost() {
      this.$store.dispatch('openEditPost', { isEdit: false, post: null });
    },
    closeErorrAlert() {
      this.$store.dispatch('toggleErrorAlert', {
        show: false,
        message: null,
      });
    },
  },
  computed: {
    posts() {
      return this.$store.getters.posts;
    },
    editDialog() {
      return this.$store.getters.editDialog;
    },
    editPost() {
      return this.$store.getters.editPost;
    },
    errorAlert() {
      return this.$store.getters.errorAlert;
    },
    errorMsg() {
      return this.$store.getters.errorMsg;
    },
  },
  watch: {
    errorAlert(value) {
      this.showErrorAlert = value;
    },
  },
};
</script>

<style scoped>
.post-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
