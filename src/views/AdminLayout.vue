<template>
  <div class="admin-layout">
    <el-menu
      :default-active="activeIndex"
      class="admin-menu"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
    >
      <el-menu-item index="/admin/groups">
        <i class="fa-solid fa-users"></i>
        <span>Manage Groups</span>
      </el-menu-item>
      <el-menu-item index="/admin/courses">
        <i class="fa-solid fa-book"></i>
        <span>Manage Courses</span>
      </el-menu-item>
      <div class="flex-grow"></div>
      <el-menu-item index="/">
        <i class="fa-solid fa-arrow-left"></i>
        <span>Exit Admin Panel</span>
      </el-menu-item>
    </el-menu>

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

<style scoped>
.admin-layout {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.flex-grow {
  flex-grow: 1;
}

.admin-content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Add responsive adjustments for mobile */
@media (max-width: 768px) {
  .admin-menu {
    overflow-x: auto;
    white-space: nowrap;
  }
  .admin-menu .el-menu-item span {
    display: none; /* Hide text on small screens, show only icons if needed, or adjust padding */
  }
  .admin-menu .el-menu-item {
    padding: 0 15px;
  }
  .admin-content {
    padding: 10px;
  }
}
</style>
