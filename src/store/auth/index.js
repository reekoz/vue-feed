let timer;

export default {
    state: {
        isAuth: false,
        token: null,
        userId: null,
        name: null
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
        }
    },
    actions: {
        async login(context, payload) {
            const res = await fetch(process.env.VUE_APP_API_ENDPOINT + '/auth/login', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    email: payload.email,
                    password: payload.password
                })
            });

            const resData = await res.json();

            if (!res.ok) {
                throw new Error(resData.message || 'Could not authenticate you');
            }

            localStorage.setItem('token', resData.token);
            localStorage.setItem('userId', resData.userId);
            localStorage.setItem('name', resData.name);

            const remainingMilliseconds = 60 * 60 * 1000;
            const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);

            localStorage.setItem('expiryDate', expiryDate.toISOString());
            context.dispatch('setAutoLogout', {
                ms: remainingMilliseconds
            });

            context.commit('setAuth', {
                isAuth: true,
                token: resData.token,
                userId: resData.userId,
                name: resData.name
            });
        },
        setAutoLogout(context, payload) {
            timer = setTimeout(() => {
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
                name: null
            });
        },
        tryLogin(context) {
            const token = localStorage.getItem('token');
            const expiryDate = localStorage.getItem('expiryDate');

            if (!token || !expiryDate)
                return;

            if (new Date(expiryDate) <= new Date()) {
                context.dispatch('logout');
                return;
            }

            const userId = localStorage.getItem('userId');
            const name = localStorage.getItem('name');
            const remainingMilliseconds = new Date(expiryDate).getTime() - new Date().getTime();
            context.dispatch('setAutoLogout', {
                ms: remainingMilliseconds
            });

            context.commit('setAuth', {
                isAuth: true,
                token: token,
                userId: userId,
                name: name
            })

        },
        async signup(context, payload) {
            const res = await fetch(process.env.VUE_APP_API_ENDPOINT + '/auth/signup', {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    email: payload.email,
                    password: payload.password,
                    name: payload.name
                })
            });

            const resData = await res.json();

            if (!res.ok) {
                throw new Error(resData.message || 'Cannot signup there is an error. Make sure the email address isn\'t used yet');
            }

            context.dispatch('logout');
        }
    },
    mutations: {
        setAuth(state, payload) {
            state.isAuth = payload.isAuth;
            state.token = payload.token;
            state.userId = payload.userId;
            state.name = payload.name;
        }
    }
};