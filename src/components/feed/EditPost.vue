<template>
  <v-form v-model="valid" @submit.prevent="editPost">
    <v-card :loading="loading">
      <v-card-title>
        <span v-if="isEdit" class="headline">Edit a Post</span>
        <span v-else class="headline">Add new Post</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-text-field
              label="Title"
              v-model="newTitle"
              :rules="titleRules"
            ></v-text-field>
          </v-row>
          <v-row>
            <v-textarea
              label="Content"
              v-model="newContent"
              :rules="contentRules"
              solo
            ></v-textarea>
          </v-row>
          <v-row>
            <v-alert type="error" v-show="error" dense text class="mx-auto mt-1">
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
        <v-btn color="primary" text @click="editPost" :disabled="!valid">
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
      loading: false,
      error: null,
      valid: false,
      newTitle: '',
      titleRules: [
        v => !!v || 'A title is required',
        v => v.length > 4 || 'Title must be at least 5 characters',
      ],
      newContent: '',
      contentRules: [
        v => !!v || 'Some content is required',
        v => v.length > 4 || 'Content must be at least 5 characters',
      ],
      id: null,
    };
  },
  computed: {
    isEdit() {
      return this.$store.getters.isEdit;
    },
    post() {
      return this.$store.getters.editPost;
    },
    editDialog() {
      return this.$store.getters.editPost;
    }
  },
  created() {
    this.setCurrentPost(this.post);
  },
  methods: {
    setCurrentPost(post) {
      this.newTitle = post ? post.title : '';
      this.newContent = post ? post.content : '';
      this.id = post ? post._id : null;
    },
    closeDialog() {
      this.$store.dispatch('toggleEditDialog');
    },
    async editPost() {
      this.loading = true;
      this.error = null;

      try {
        await this.$store.dispatch('updatePost', {
          title: this.newTitle,
          content: this.newContent,
          isEdit: this.isEdit,
          _id: this.id,
        });
        this.loading = false;
        this.closeDialog();
      } catch (err) {
        this.error = err.message || err;
        this.loading = false;
      }
    },
  },
  watch: {
    post(newPost) {
      this.setCurrentPost(newPost);
    },
    editDialog(state) {
      if (state)
        this.error = null;
    }
  },
};
</script>
