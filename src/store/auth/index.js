let timer;

export default {
  namespaced: true,
  state: {
    isAuth: false,
    token: null,
    userId: null,
    name: null,
    themeMode: localStorage.getItem('themeMode') || 'dark',
    status: null,
    color: localStorage.getItem('color') || 'teal',
    shade: localStorage.getItem('shade'),
  },
  getters: {
    isAuth(state) {
      return state.isAuth;
    },
    token(state) {
      return state.token;
    },
    userId(state) {
      return state.userId;
    },
    name(state) {
      return state.name;
    },
    themeMode(state) {
      return state.themeMode;
    },
    status(state) {
      return state.status;
    },
    color(state) {
      return state.color;
    },
    shade(state) {
      return state.shade;
    },
  },
  actions: {
    async login(context, payload) {
      const res = await fetch(
        process.env.VUE_APP_API_ENDPOINT + '/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            email: payload.email,
            password: payload.password,
          }),
        }
      );

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || 'Could not authenticate you');
      }

      localStorage.setItem('token', resData.token);
      localStorage.setItem('userId', resData.userId);
      localStorage.setItem('name', resData.name);
      localStorage.setItem('themeMode', resData.themeMode);
      localStorage.setItem('color', resData.color);

      if (resData.shade)
        localStorage.setItem('shade', resData.shade);

      const remainingMilliseconds = 60 * 60 * 1000;
      const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);

      localStorage.setItem('expiryDate', expiryDate.toISOString());
      context.dispatch('setAutoLogout', {
        ms: remainingMilliseconds,
      });

      context.commit('setAuth', {
        isAuth: true,
        token: resData.token,
        userId: resData.userId,
        name: resData.name,
        themeMode: resData.themeMode,
        color: resData.color,
        shade: resData.shade,
      });
    },
    setAutoLogout(context, payload) {
      timer = setTimeout(() => {
        context.dispatch('toggleAlert', {
          show: true,
          message:
            'Your session has expired, you will be forced to login again',
          type: 'warning',
        });
        context.dispatch('logout');
      }, payload.ms);
    },
    logout(context) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('name');
      localStorage.removeItem('expiryDate');

      clearTimeout(timer);

      context.commit('setAuth', {
        isAuth: false,
        token: null,
        userId: null,
        name: null,
        themeMode: localStorage.getItem('themeMode'),
        color: localStorage.getItem('color'),
        shade: localStorage.getItem('shade'),
      });
    },
    tryLogin(context) {
      const token = localStorage.getItem('token');
      const expiryDate = localStorage.getItem('expiryDate');

      if (!token || !expiryDate) return;

      if (new Date(expiryDate) <= new Date()) {
        context.dispatch('toggleAlert', {
          show: true,
          message:
            'Your session has expired, you will be forced to login again',
          type: 'warning',
        });
        context.dispatch('logout');
        return;
      }

      const userId = localStorage.getItem('userId');
      const name = localStorage.getItem('name');
      const themeMode = localStorage.getItem('themeMode');
      const color = localStorage.getItem('color');
      const shade = localStorage.getItem('shade');

      const remainingMilliseconds =
        new Date(expiryDate).getTime() - new Date().getTime();

      context.dispatch('setAutoLogout', {
        ms: remainingMilliseconds,
      });

      context.commit('setAuth', {
        isAuth: true,
        token: token,
        userId: userId,
        name: name,
        themeMode: themeMode,
        color: color,
        shade: shade,
      });
    },
    async signup(context, payload) {
      const res = await fetch(
        process.env.VUE_APP_API_ENDPOINT + '/auth/signup',
        {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            email: payload.email,
            password: payload.password,
            name: payload.name,
          }),
        }
      );

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(
          resData.message ||
            "Cannot signup there is an error. Make sure the email address isn't used yet"
        );
      }

      context.dispatch('logout');
    },
    async updateSettings(context, payload) {
      const res = await fetch(
        process.env.VUE_APP_API_ENDPOINT +
          '/auth/settings/' +
          context.getters.userId,
        {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer ' + context.getters.token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: payload.name,
            themeMode: payload.themeMode,
            color: payload.color,
            shade: payload.shade,
          }),
        }
      );

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || 'Update settings failed');
      }

      localStorage.setItem('name', payload.name);
      localStorage.setItem('themeMode', payload.themeMode);
      localStorage.setItem('color', payload.color);

      if (payload.shade)
        localStorage.setItem('shade', payload.shade);

      context.commit('setSettings', payload);
    },
    async getStatus(context) {
      const res = await fetch(
        process.env.VUE_APP_API_ENDPOINT +
          '/auth/status/' +
          context.getters.userId,
        {
          headers: {
            Authorization: 'Bearer ' + context.getters.token,
          },
        }
      );

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || 'Failed to fetch status');
      }

      context.commit('setStatus', resData);
    },
    async updateStatus(context, payload) {
      const res = await fetch(
        process.env.VUE_APP_API_ENDPOINT +
          '/auth/status/' +
          context.getters.userId,
        {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer ' + context.getters.token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: payload.status,
          }),
        }
      );

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || 'Update status failed');
      }

      context.commit('setStatus', payload);
    },
  },
  mutations: {
    setAuth(state, payload) {
      state.isAuth = payload.isAuth;
      state.token = payload.token;
      state.userId = payload.userId;
      state.name = payload.name;
      state.themeMode = payload.themeMode;
      state.color = payload.color;
      state.shade = payload.shade;
    },
    setSettings(state, payload) {
      state.themeMode = payload.themeMode;
      state.name = payload.name;
      state.color = payload.color;
      state.shade = payload.shade;
    },
    setStatus(state, payload) {
      state.status = payload.status;
    },
  },
};
