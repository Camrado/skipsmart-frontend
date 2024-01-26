import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Home Page - SmartSkip'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/LoginView.vue'),
    meta: {
      title: 'Sign In Page - SmartSkip'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "login" */ '../views/RegisterView.vue'),
    meta: {
      title: 'Sign Up Page - SmartSkip'
    }
  },
  {
    path: '/timetable',
    name: 'timetable',
    component: () => import(/* webpackChunkName: "timetable" */ '../views/TimetableView.vue'),
    meta: {
      title: 'Timetable - SmartSkip'
    }
  },
  {
    path: '/me/attendance-statistics',
    name: 'attendance-statistics',
    component: () => import(/* webpackChunkName: "attendance-statistics" */ '../views/AttendanceStatisticsView.vue'),
    meta: {
      title: 'Attendance Statistics - SmartSkip'
    }
  },
  {
    path: '/me/settings',
    name: 'settings',
    component: () => import(/* webpackChunkName: "settings" */ '../views/SettingsView.vue'),
    meta: {
      title: 'Settings - SmartSkip'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "404" */ '@/views/NotFoundView.vue'),
    meta: {
      title: '404 Page Not Found - SmartSkip'
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
