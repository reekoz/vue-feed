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
      <v-col lg="2" md="3" sm="4" xs="12">
        <v-btn color="primary" block @click.stop="addPost">
          New Post
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-pagination v-model="page" :length="pageLenght"></v-pagination>
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
    <v-row justify="center">
      <v-pagination v-model="page" :length="pageLenght"></v-pagination>
    </v-row>
  </v-container>
</template>

<script>
import FeedPost from '../../components/feed/FeedPost.vue';
import EditPost from '../../components/feed/EditPost.vue';

export default {
  components: { EditPost, FeedPost },
  data() {
    return {
      loading: false,
      error: null,
      addDialog: false,
      openDialog: false,
      page: 1,
      postsPerPage: 6,
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
        await this.$store.dispatch('loadPosts', {
          page: this.page,
          perPage: this.postsPerPage,
        });
      } catch (err) {
        this.error = err.message || err;
      }

      this.loading = false;
    },
    addPost() {
      this.$store.dispatch('openEditPost', { isEdit: false, post: null });
    },
    nextPage() {
      this.page++;
      this.loadPosts();
    },
    prevPage() {
      this.page--;
      this.loadPosts();
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
    pageLenght() {
      const total = this.$store.getters.totalPosts;
      return Math.ceil(total / this.postsPerPage);
    },
  },
  watch: {
    page() {
      this.loadPosts();
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
