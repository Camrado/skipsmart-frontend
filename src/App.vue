<template>
  <Preloader v-if="showPreloader" />
  <div class="test" v-touch:swipe.left="changePageLeft" v-touch:swipe.right="changePageRight">
    <router-view />
    <GrowBottomNavigation
      v-if="store.getters['User/GET_IS_SIGNED_IN'] && !showPreloader"
      :options="state.options"
      v-model="state.selected"
      style="padding: 0 10px"
    >
    </GrowBottomNavigation>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import Preloader from '@/components/Preloader.vue';
import { useRoute, useRouter } from 'vue-router';
import { GrowBottomNavigation } from 'bottom-navigation-vue';
import 'bottom-navigation-vue/dist/style.css';
import mixpanel from 'mixpanel-browser';

export default {
  components: { Preloader, GrowBottomNavigation },

  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const state = reactive({
      selected: 1,
      options: [
        { id: 1, icon: 'fa-solid fa-home', color: '#e23c55', title: 'Home', path: { name: 'home' } },
        { id: 2, icon: 'fa-solid fa-calendar', color: '#6091b8', title: 'Timetable', path: { name: 'timetable' } },
        {
          id: 3,
          icon: 'fa-solid fa-chart-simple',
          color: '#4ea080',
          title: 'Statistics',
          path: { name: 'attendance-statistics' }
        },
        { id: 4, icon: 'fa-solid fa-gear', color: '#03336d', title: 'Settings', path: { name: 'settings' } }
      ]
    });

    let appMounted = ref(false);
    let showPreloader = ref(true);

    onMounted(async () => {
      mixpanel.init(process.env.VUE_APP_MIXPANEL_PROJECT_TOKEN, {
        debug: true,
        track_pageview: true,
        persistence: 'localStorage'
      });

      // if there is no jwt token or expireDate in localStorage
      if (
        !localStorage.getItem(store.getters['User/GET_JWT_LKEY']) ||
        !localStorage.getItem(store.getters['User/GET_EXPIRATION_DATE_KEY'])
      ) {
        store.dispatch('User/SET_SIGNED_IN', false);
        appMounted.value = true;

        // setting this timeout so if the user tries to access the login or register pages while being logged in the preloader disappears after the router pushes to '/'
        setTimeout(() => {
          showPreloader.value = false;
        }, 200);
        return;
      }

      // if the jwt token has expired
      if (new Date(localStorage.getItem(store.getters['User/GET_EXPIRATION_DATE_KEY'])) < new Date()) {
        store.dispatch('User/SET_SIGNED_IN', false);
        localStorage.removeItem(store.getters['User/GET_JWT_LKEY']);
        localStorage.removeItem(store.getters['User/GET_EXPIRATION_DATE_KEY']);
        appMounted.value = true;

        // setting this timeout so if the user tries to access the login or register pages while being logged in the preloader disappears after the router pushes to '/'
        setTimeout(() => {
          showPreloader.value = false;
        }, 200);
        return;
      }

      const token = localStorage.getItem(store.getters['User/GET_JWT_LKEY']);

      try {
        const response = await fetch(store.getters['GET_URL'] + '/users/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          const userData = await response.json();

          store.dispatch('User/SET_USER_ID', userData.id);
          store.dispatch('User/SET_SIGNED_IN', true);
          store.dispatch('User/SET_FIRSTNAME', userData.firstName);
          store.dispatch('User/SET_LASTNAME', userData.lastName);
          store.dispatch('User/SET_EMAIL', userData.email);
          store.dispatch('User/SET_GROUP_ID', userData.groupId);
          store.dispatch('User/SET_LANGUAGE_SUBGROUP', userData.languageSubgroup);
          store.dispatch('User/SET_FACULTY_SUBGROUP', userData.facultySubgroup);

          mixpanel.identify(userData.id);

          mixpanel.people.set({
            $name: `${userData.firstName} ${userData.lastName}`,
            $email: userData.email
          });

          mixpanel.track('Signed In Page View', {
            'First Name': userData.firstName,
            'Last Name': userData.lastName,
            "User' Email": userData.email,
            "User' Group ID": userData.groupId,
            "User' Group Name": userData.groupName
          });
        } else if (response.status === 401) {
          store.dispatch('User/SET_SIGNED_IN', false);

          localStorage.removeItem(store.getters['User/GET_JWT_LKEY']);
          localStorage.removeItem(store.getters['User/GET_EXPIRATION_DATE_KEY']);

          ElMessage.error({ message: 'The provided credentials are invalid.', showClose: true });
        } else {
          store.dispatch('User/SET_SIGNED_IN', false);
          ElMessage.error({ message: 'Some server error has ocurred. Please try again later.', showClos: true });
        }
      } catch {
        store.dispatch('User/SET_SIGNED_IN', false);
        ElMessage.error({ message: 'Some server error has ocurred. Please try again later.', showClos: true });
      }

      appMounted.value = true;

      // setting this timeout so if the user tries to access the login or register pages while being logged in the preloader disappears after the router pushes to '/'
      setTimeout(() => {
        showPreloader.value = false;
      }, 200);
    });

    function changePageLeft() {
      if (!store.getters['User/GET_IS_SIGNED_IN']) return;

      if (route.name == 'home') {
        router.push('/timetable');
      } else if (route.name == 'timetable') {
        router.push('/me/attendance-statistics');
      } else if (route.name == 'attendance-statistics') {
        router.push('/me/settings');
      }
    }

    function changePageRight() {
      if (!store.getters['User/GET_IS_SIGNED_IN']) return;

      if (route.name == 'settings') {
        router.push('/me/attendance-statistics');
      } else if (route.name == 'attendance-statistics') {
        router.push('/timetable');
      } else if (route.name == 'timetable') {
        router.push('/');
      }
    }

    return { appMounted, showPreloader, store, changePageLeft, changePageRight, state };
  }
};
</script>

<style lang="scss"></style>
