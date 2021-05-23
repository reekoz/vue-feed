export default {
  state() {
    return {
      posts: [],
      editDialog: false,
      isEdit: false,
      editPost: null,
      totalPosts: 0
    };
  },
  getters: {
    posts(state) {
      return state.posts;
    },
    editDialog(state) {
      return state.editDialog;
    },
    isEdit(state) {
      return state.isEdit;
    },
    editPost(state) {
      return state.editPost;
    },
    totalPosts(state) {
      return state.totalPosts;
    },
    },
  actions: {
    async loadPosts(context, payload) {
      const res = await fetch(
        process.env.VUE_APP_API_ENDPOINT + `/feed/posts?page=${payload.page}&perPage=${payload.perPage}`,
        {
          headers: {
            Authentication: 'Bearer ' + context.getters.token,
          },
        }
      );

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || 'Could not fetch posts');
      }

      context.commit('setPosts', {
        posts: resData.posts,
        totalPosts: resData.totalItems
      });
    },
    async updatePost(context, payload) {
      let url = process.env.VUE_APP_API_ENDPOINT + '/feed/post';
      let method = 'POST';

      if (payload.isEdit) {
        url = process.env.VUE_APP_API_ENDPOINT + '/feed/post/' + payload._id;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method: method,
        headers: {
          Authentication: 'Bearer ' + context.getters.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: payload.title,
          content: payload.content,
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || 'Creating or editing a post failed');
      }

      const posts = [...context.getters.posts];

      if (payload.isEdit) {
        const index = posts.findIndex(p => p._id === resData.post._id);

        if (index > -1) posts[index] = resData.post;
      } else posts.unshift(resData.post);

      context.commit('setPosts', {
        posts: posts,
        totalPosts: resData.totalItems
      });
    },
    openEditPost(context, payload) {
      context.commit('setIsEdit', payload);
      context.commit('setEditPost', payload);
      context.commit('toggleEditDialog');
    },
    toggleEditDialog(context) {
      context.commit('toggleEditDialog');
    },
    async deletePost(context, payload) {
      const res = await fetch(
        process.env.VUE_APP_API_ENDPOINT + '/feed/post/' + payload._id,
        {
          method: 'DELETE',
          headers: {
            Authentication: 'Bearer ' + context.getters.token,
          },
        }
      );

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || 'Deleting a post failed');
      }
    },
  },
  mutations: {
    setPosts(state, payload) {
      state.posts = payload.posts;
      state.totalPosts = payload.totalPosts;
    },
    toggleEditDialog(state) {
      state.editDialog = !state.editDialog;
    },
    setIsEdit(state, payload) {
      state.isEdit = payload.isEdit;
    },
    setEditPost(state, payload) {
      state.editPost = payload.post;
    },
  },
};
