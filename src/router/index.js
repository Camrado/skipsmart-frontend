import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Attendance Recorder - Home Page'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/LoginView.vue'),
    meta: {
      title: 'Attendance Recorder - Sign In Page'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "login" */ '../views/RegisterView.vue'),
    meta: {
      title: 'Attendance Recorder - Sign Up Page'
    }
  },
  {
    path: '/timetable',
    name: 'timetable',
    component: () => import(/* webpackChunkName: "timetable" */ '../views/TimetableView.vue'),
    meta: {
      title: 'Attendance Recorder - Timetable'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "404" */ '@/views/NotFoundView.vue'),
    meta: {
      title: 'Attendance Recorder - 404 Page Not Found'
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.resolve({
  name: 'NotFound',
  params: { pathMatch: ['404'] }
}).href; // '/404'

router.afterEach((to) => {
  document.title = to.meta.title;
});

export default router;
