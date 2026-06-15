import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import store from '../store';
import { jwtDecode } from 'jwt-decode';

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
    path: '/admin',
    name: 'admin',
    component: () => import(/* webpackChunkName: "admin" */ '../views/AdminLayout.vue'),
    redirect: '/admin/groups',
    meta: {
      requiresAdmin: true
    },
    children: [
      {
        path: 'groups',
        name: 'admin-groups',
        component: () => import(/* webpackChunkName: "admin" */ '../views/AdminGroupsView.vue'),
        meta: {
          title: 'Manage Groups - Admin Panel',
          requiresAdmin: true
        }
      },
      {
        path: 'courses',
        name: 'admin-courses',
        component: () => import(/* webpackChunkName: "admin" */ '../views/AdminCoursesView.vue'),
        meta: {
          title: 'Manage Courses - Admin Panel',
          requiresAdmin: true
        }
      }
    ]
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

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    let isAdmin = false;
    const token = localStorage.getItem(store.getters['User/GET_JWT_LKEY']);

    if (token) {
      try {
        const payload = jwtDecode(token);
        isAdmin = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Admin' || payload['role'] === 'Admin';
      } catch (e) {
        console.error('Failed to parse JWT payload in router guard', e);
      }
    }

    store.dispatch('User/SET_IS_ADMIN', isAdmin);

    if (!isAdmin) {
      next({ name: 'home' });
    } else {
      next();
    }
  } else {
    next();
  }
});

router.afterEach((to) => {
  document.title = to.meta.title;
});

export default router;
