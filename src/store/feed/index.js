export default {
  namespaced: true,
  state() {
    return {
      posts: [],
      editDialog: false,
      isEdit: false,
      editPost: null,
      totalPosts: 0,
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
      let page = 1;
      let perPage = 6;

      if (payload) {
        page = payload.page;
        perPage = payload.perPage;
      }

      const res = await fetch(
        process.env.VUE_APP_API_ENDPOINT +
          `/feed/posts?page=${page}&perPage=${perPage}`,
        {
          headers: {
            Authorization: 'Bearer ' + context.rootGetters['auth/token'],
          },
        }
      );

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || 'Could not fetch posts');
      }

      context.commit('setPosts', {
        posts: resData.posts,
        totalPosts: resData.totalItems,
      });
    },
    async editPost(context, payload) {
      let url = process.env.VUE_APP_API_ENDPOINT + '/feed/post';
      let method = 'POST';

      if (payload.isEdit) {
        url = process.env.VUE_APP_API_ENDPOINT + '/feed/post/' + payload._id;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method: method,
        headers: {
          Authorization: 'Bearer ' + context.rootGetters['auth/token'],
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
    },
    addPost(context, payload) {
      const newPost = context.getters.posts.find(
        p => p._id === payload.post._id
      );

      if (!newPost) {
        const posts = [payload.post, ...context.getters.posts];

        context.commit('setPosts', {
          posts: posts,
          totalPosts: payload.totalItems,
        });
      }
    },
    updatePost(context, payload) {
      const posts = [...context.getters.posts];
      const index = posts.findIndex(p => p._id === payload.post._id);
      if (index > -1) posts[index] = payload.post;
      context.commit('setPosts', {
        posts: posts,
        totalPosts: payload.totalItems,
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
            Authorization: 'Bearer ' + context.rootGetters['auth/token'],
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
