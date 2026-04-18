<template>
  <div class="admin-layout">
    <header class="admin-header">
      <div class="header-container">
        <!-- Logo -->
        <div class="admin-brand">
          <img src="../assets/images/logo-round-background.png" alt="SkipSmart" class="admin-logo" />
          <span>SkipSmart Admin</span>
        </div>

        <!-- Navigation Links -->
        <nav class="admin-nav">
          <router-link to="/admin/groups" class="nav-item" active-class="nav-item-active">
            <i class="fa-solid fa-users"></i>
            <span>Groups</span>
          </router-link>
          <router-link to="/admin/courses" class="nav-item" active-class="nav-item-active">
            <i class="fa-solid fa-book"></i>
            <span>Courses</span>
          </router-link>
        </nav>

        <!-- Exit Button -->
        <div class="header-exit">
          <router-link to="/">
            <button class="scale-button exit-btn">
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
              <span>Exit Admin</span>
            </button>
          </router-link>
        </div>
      </div>
    </header>

    <div class="admin-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'AdminLayout',
  setup() {
    const route = useRoute();
    const activeIndex = computed(() => route.path);
    return { activeIndex };
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/admin.scss';
</style>
