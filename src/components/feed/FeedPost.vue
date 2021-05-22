<template>
  <v-card class="mx-auto ml-1 mr-1 post" max-width="400">
    <v-img :src="getImage" height="267"></v-img>
    <v-card-title>{{ post.title }}</v-card-title>
    <v-card-subtitle>
      Created by {{ post.creator.name }} at {{ creationDate }}
    </v-card-subtitle>
    <v-card-text>{{ post.content }}</v-card-text>
    <v-card-actions>
      <v-btn text @click.stop="editPost">
        Edit
      </v-btn>
      <v-dialog v-model="dialogDelete" max-width="400">
        <template v-slot:activator="{ on, attrs }">
          <v-btn text color="error" v-bind="attrs" v-on="on">
            Delete
          </v-btn>
        </template>
        <v-card flat>
          <v-card-title> Confirm Delete Post '{{ post.title }}' </v-card-title>
          <v-card-text>
            Are you sure you want to delete this post?
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialogDelete = false">
              Close
            </v-btn>
            <v-btn color="error" @click="deletePost">
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ['post'],
  data() {
    return {
      dialogDelete: false,
      valid: false,
    };
  },
  computed: {
    creationDate() {
      return new Date(this.post.createdAt).toLocaleDateString('en-US');
    },
    getImage() {
      return this.post.imageUrl || '/img/no_image.png';
    },
  },
  methods: {
    async deletePost() {
      try {
        await this.$store.dispatch('deletePost', { _id: this.post._id });
        await this.$store.dispatch('loadPosts');
        this.dialogDelete = false;
      } catch (err) {
        this.dialogDelete = false;
        this.deleteError = err.message || err;
        this.$store.dispatch('toggleAlert', {
          show: true,
          message: err.message || err,
          type: 'error'
        });
      }
    },
    editPost() {
      this.$store.dispatch('openEditPost', { isEdit: true, post: this.post });
    },
  },
};
</script>

<style scoped>
.post {
  margin: 0.5rem 0.5rem;
}
</style>
