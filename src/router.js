import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store/index.js';
import Feed from './pages/feed/Feed.vue';

Vue.use(VueRouter);

const Login = () => import('./pages/auth/Login.vue');
const Signup = () => import('./pages/auth/Signup.vue');
const NotFound = () => import('./pages/NotFound.vue');

const router = new VueRouter({
  mode: 'history',
  routes: [{
      path: '/',
      redirect: '/feed'
    },
    {
      path: '/login',
      component: Login,
      meta: {
        requiresUnauth: true
      }
    },
    {
      path: '/signup',
      component: Signup,
      meta: {
        requiresUnauth: true
      }
    },
    {
      path: '/feed',
      component: Feed,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/:notFound(.*)',
      component: NotFound
    }
  ]
});

router.beforeEach(function (to, from, next) {
  if (to.meta.requiresAuth && !store.getters.isAuth)
    next('/login');
  else if (to.meta.requiresUnauth && store.getters.isAuth)
    next('/');
  else
    next();
});

export default router;