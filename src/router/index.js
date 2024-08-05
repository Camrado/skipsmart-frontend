import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Home Page - SkipSmart'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/LoginView.vue'),
    meta: {
      title: 'Sign In Page - SkipSmart'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "login" */ '../views/RegisterView.vue'),
    meta: {
      title: 'Sign Up Page - SkipSmart'
    }
  },
  {
    path: '/timetable',
    name: 'timetable',
    component: () => import(/* webpackChunkName: "timetable" */ '../views/TimetableView.vue'),
    meta: {
      title: 'Timetable - SkipSmart'
    }
  },
  {
    path: '/me/attendance-statistics',
    name: 'attendance-statistics',
    component: () => import(/* webpackChunkName: "attendance-statistics" */ '../views/AttendanceStatisticsView.vue'),
    meta: {
      title: 'Attendance Statistics - SkipSmart'
    }
  },
  {
    path: '/me/settings',
    name: 'settings',
    component: () => import(/* webpackChunkName: "settings" */ '../views/SettingsView.vue'),
    meta: {
      title: 'Settings - SkipSmart'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "404" */ '@/views/NotFoundView.vue'),
    meta: {
      title: '404 Page Not Found - SkipSmart'
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
