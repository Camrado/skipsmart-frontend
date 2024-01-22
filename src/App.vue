<template>
  <Preloader v-if="showPreloader" />
  <router-view />
</template>

<script>
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';
import Preloader from '@/components/Preloader.vue';

export default {
  components: { Preloader },

  setup() {
    const store = useStore();
    const toast = useToast();
    let appMounted = ref(false);
    let showPreloader = ref(true);

    onMounted(async () => {
      // if there is no jwt token or expireDate in localStorage
      if (
        !localStorage.getItem(store.getters['User/GET_JWT_KEY']) ||
        !localStorage.getItem(store.getters['User/GET_EXPIRE_DATE_KEY'])
      ) {
        store.dispatch('User/SET_SIGNED_IN', false);
        appMounted.value = true;

        // setting this timeout so if the user tries to access the login or register pages while being logged in the preloader disappears after the router pushes to '/'
        setTimeout(() => {
          showPreloader.value = false;
        }, 500);
        return;
      }

      // if the jwt token has expired
      if (localStorage.getItem(store.getters['User/GET_EXPIRE_DATE_KEY']) < new Date()) {
        store.dispatch('User/SET_SIGNED_IN', false);
        localStorage.removeItem(store.getters['User/GET_JWT_KEY']);
        localStorage.removeItem(store.getters['User/GET_EXPIRE_DATE_KEY']);
        appMounted.value = true;

        // setting this timeout so if the user tries to access the login or register pages while being logged in the preloader disappears after the router pushes to '/'
        setTimeout(() => {
          showPreloader.value = false;
        }, 500);
        return;
      }

      const token = localStorage.getItem(store.getters['User/GET_JWT_KEY']);

      const response = await fetch(store.getters['GET_URL'] + '/student/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.status === 200) {
        store.dispatch('User/SET_SIGNED_IN', true);
        store.dispatch('User/SET_USERNAME', data.username);
        store.dispatch('User/SET_GROUP', data.group);
        store.dispatch('User/SET_TERM', data.term);
        // store.dispatch('User/SET_SEMESTER', data.semester);
      } else {
        store.dispatch('User/SET_SIGNED_IN', false);
        toast.error(data.msg);
      }

      appMounted.value = true;

      // setting this timeout so if the user tries to access the login or register pages while being logged in the preloader disappears after the router pushes to '/'
      setTimeout(() => {
        showPreloader.value = false;
      }, 500);
    });

    return { appMounted, showPreloader };
  }
};
</script>

<style lang="scss"></style>
