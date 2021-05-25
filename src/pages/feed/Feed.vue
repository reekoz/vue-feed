<template>
  <v-container>
    <v-dialog v-model="editDialog" persistent max-width="400">
      <edit-post></edit-post>
    </v-dialog>
    <v-row justify="center">
      <v-text-field
        label="Yout Status"
        v-model="status"
        placeholder="Something..."
        clearable
        class="mr-2 shrink"
      ></v-text-field>
      <v-btn color="primary" @click="updateStatus" outlined large>
        Update
      </v-btn>
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
    <v-row v-if="loading" justify="center">
      <v-skeleton-loader
        v-for="n in postsPerPage"
        :key="n"
        class="mx-auto ml-1 mr-1"
        width="400"
        type="card"
      ></v-skeleton-loader>
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
import openSocket from 'socket.io-client';

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
      status: null,
    };
  },
  created() {
    this.loadPosts();
    this.getStatus();
    const socket = openSocket(process.env.VUE_APP_API_ENDPOINT);
    socket.on('posts', async data => {
      switch (data.action) {
        case 'create':
          this.$store.dispatch('feed/addPost', {
            post: data.post,
            totalItems: data.totalItems,
          });
          break;
        case 'update':
          this.$store.dispatch('feed/updatePost', {
            post: data.post,
            totalItems: data.totalItems,
          });
          break;
        case 'delete':
          try {
            await this.$store.dispatch('feed/loadPosts');
          } catch (err) {
            this.$store.dispatch('toggleAlert', {
              show: true,
              message: err.message || err,
              type: 'error',
            });
          }
          break;
      }
    });
  },
  methods: {
    async loadPosts() {
      this.loading = true;
      this.error = null;

      try {
        await this.$store.dispatch('feed/loadPosts', {
          page: this.page,
          perPage: this.postsPerPage,
        });
      } catch (err) {
        this.error = err.message || err;
      }

      this.loading = false;
    },
    addPost() {
      this.$store.dispatch('feed/openEditPost', { isEdit: false, post: null });
    },
    nextPage() {
      this.page++;
      this.loadPosts();
    },
    prevPage() {
      this.page--;
      this.loadPosts();
    },
    async getStatus() {
      try {
        await this.$store.dispatch('auth/getStatus');
        this.status = this.$store.getters['auth/status'];
      } catch (err) {
        this.$store.dispatch('toggleAlert', {
          show: true,
          message: err.message || err,
          type: 'error',
        });
      }
    },
    async updateStatus() {
      try {
        await this.$store.dispatch('auth/updateStatus', { status: this.status });
        this.$store.dispatch('toggleAlert', {
          show: true,
          message: 'Status updated!',
          type: 'success',
        });
      } catch (err) {
        this.$store.dispatch('toggleAlert', {
          show: true,
          message: err.message || err,
          type: 'error',
        });
      }
    },
  },
  computed: {
    posts() {
      return this.$store.getters['feed/posts'];
    },
    editDialog() {
      return this.$store.getters['feed/editDialog'];
    },
    editPost() {
      return this.$store.getters['feed/editPost'];
    },
    pageLenght() {
      const total = this.$store.getters['feed/totalPosts'];
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
