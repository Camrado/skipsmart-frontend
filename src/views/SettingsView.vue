<template>
  <div class="settings-page">
    <div class="header">
      <div class="header-logo">
        <img src="../assets/images/logo-round-background.png" alt="SkipSmart Logo" />
        <span>SkipSmart</span>
      </div>
      <div class="header-button"></div>
    </div>

    <div class="container" v-loading="state.settingsLoading">
      <div class="settings-header">
        <img src="../assets/images/profile-user.png" alt="Profile Image" />
        <div>
          <h1>{{ store.getters['User/GET_FIRSTNAME'] }} {{ store.getters['User/GET_LASTNAME'] }}</h1>
          <h2>{{ store.getters['User/GET_EMAIL'] }}</h2>
        </div>
      </div>

      <hr />

      <h2>Account Settings</h2>

      <div class="change-group">
        <el-form :model="state.groupId" status-icon label-position="top">
          <el-form-item label="Group">
            <el-select v-model="state.groupId" placeholder="Group">
              <el-option
                v-for="group in state.groups"
                v-bind:key="group.id"
                :label="group.groupName"
                :value="group.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <el-popconfirm
          width="250"
          confirm-button-text="Yes"
          cancel-button-text="No, I am not sure"
          :icon="InfoFilled"
          icon-color="#e23c55"
          title="All the current data about your attendance will be deleted. Are you sure?"
          @confirm="changeGroup"
        >
          <template #reference>
            <el-button :loading="state.groupLoadingBtn">Change Group</el-button>
          </template>
        </el-popconfirm>
      </div>
      <br />
      <div class="change-subgroups">
        <el-form status-icon label-position="top" v-if="state.isTheGroupFirstYear">
          <el-form-item label="Subgroup">
            <el-select v-model="subgroupForFirstYearStudents" placeholder="Subgroup">
              <el-option label="1" value="1"></el-option>
              <el-option label="2" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <el-form status-icon label-position="top" v-if="state.isTheGroupSecondYear">
          <el-form-item label="Language Subgroup Teacher">
            <el-select v-model="state.languageSubgroup" placeholder="Language Subgroup Teacher">
              <el-option
                v-for="l1_group in L1_LANGUAGE_GROUPS"
                :key="l1_group.group"
                :label="l1_group.teacher + ' - ' + l1_group.language"
                :value="l1_group.group"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="Faculty Subgroup">
            <el-select v-model="state.facultySubgroup" placeholder="Faculty Subgroup">
              <el-option label="1" value="1"></el-option>
              <el-option label="2" value="2"></el-option>
              <el-option label="3" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <el-form status-icon label-position="top" v-if="!state.isTheGroupFirstYear && !state.isTheGroupSecondYear">
          <el-form-item label="Language Subgroup">
            <el-select v-model="state.languageSubgroup" placeholder="Language Subgroup">
              <el-option label="1" value="1"></el-option>
              <el-option label="2" value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="Faculty Subgroup">
            <el-select v-model="state.facultySubgroup" placeholder="Faculty Subgroup">
              <el-option label="1" value="1"></el-option>
              <el-option label="2" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <el-popconfirm
          width="250"
          confirm-button-text="Yes"
          cancel-button-text="No, I am not sure"
          :icon="InfoFilled"
          icon-color="#e23c55"
          title="All the current data about your attendance will be deleted. Are you sure?"
          @confirm="changeSubgroups"
        >
          <template #reference>
            <el-button :loading="state.subgroupLoadingBtn">Change Subgroup</el-button>
          </template>
        </el-popconfirm>
      </div>

      <br />

      <div class="logout">
        <el-popconfirm
          width="250"
          confirm-button-text="Yes"
          cancel-button-text="No"
          :icon="InfoFilled"
          icon-color="#e23c55"
          title="Are you sure?"
          @confirm="logout"
        >
          <template #reference>
            <el-button>Log Out</el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, watch, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import App from '@/App.vue';
import { ElMessage } from 'element-plus';
import mixpanel from 'mixpanel-browser';
import L1_LANGUAGE_GROUPS from '@/assets/js/l1-language-teachers';

export default {
  name: 'SettingsView',

  setup() {
    const store = useStore();
    const router = useRouter();
    const { appMounted } = App.setup();

    const state = reactive({
      settingsLoading: true,
      groupLoadingBtn: false,
      subgroupLoadingBtn: false,
      groups: [],
      groupId: '',
      languageSubgroup: undefined,
      facultySubgroup: undefined,
      isTheGroupFirstYear: false,
      firstYearGroupIds: [],
      isTheGroupSecondYear: false,
      secondYearGroupIds: []
    });

    const subgroupForFirstYearStudents = computed({
      get() {
        return state.languageSubgroup;
      },
      set(value) {
        state.languageSubgroup = value;
        state.facultySubgroup = value;
      }
    });

    watch(appMounted, async (appMounted) => {
      if (appMounted) {
        if (!store.getters['User/GET_IS_SIGNED_IN']) {
          ElMessage.info({ message: 'You need to be signed in to access this page.', showClose: true });
          router.push('/');
        } else {
          try {
            state.settingsLoading = true;

            const response = await fetch(store.getters['GET_URL'] + '/groups/all', {
              method: 'GET'
            });

            const groups = await response.json();

            if (response.status === 200) {
              state.groups = groups.sort((a, b) => a.groupName.localeCompare(b.groupName));
              state.groupId = store.getters['User/GET_GROUP_ID'];

              state.firstYearGroupIds = state.groups.slice(0, 5).map((group) => group.id);
              state.isTheGroupFirstYear = state.firstYearGroupIds.includes(state.groupId);

              state.secondYearGroupIds = state.groups.slice(5, 10).map((group) => group.id);
              state.isTheGroupSecondYear = state.secondYearGroupIds.includes(state.groupId);

              state.languageSubgroup = store.getters['User/GET_LANGUAGE_SUBGROUP'];
              state.facultySubgroup = store.getters['User/GET_FACULTY_SUBGROUP'];
            } else {
              ElMessage.error({ message: 'Server Error. Failed to fetch groups. Please try again later.', showClose: true });
              router.push('/');
            }
          } catch {
            ElMessage.error({ message: 'Server Error. Failed to fetch groups. Please try again later.', showClose: true });
            router.push('/');
          } finally {
            state.settingsLoading = false;
          }
        }
      }
    });

    async function changeGroup() {
      if (state.groupId == store.getters['User/GET_GROUP_ID']) {
        return ElMessage.warning({ message: 'Change the group to proceed.', showClose: true });
      }
      state.groupLoadingBtn = true;

      const token = localStorage.getItem(store.getters['User/GET_JWT_LKEY']);

      try {
        const response = await fetch(store.getters['GET_URL'] + '/users/change-group', {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ newGroupId: state.groupId })
        });

        if (response.status === 200) {
          if (
            state.secondYearGroupIds.includes(store.getters['User/GET_GROUP_ID']) ||
            state.firstYearGroupIds.includes(state.groupId)
          ) {
            await fetch(store.getters['GET_URL'] + '/users/change-subgroups', {
              method: 'PATCH',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                newLanguageSubgroup: Number(1),
                newFacultySubgroup: Number(1)
              })
            });

            state.facultySubgroup = 1;
            state.languageSubgroup = 1;
            store.dispatch('User/SET_LANGUAGE_SUBGROUP', state.languageSubgroup);
            store.dispatch('User/SET_FACULTY_SUBGROUP', state.facultySubgroup);
          }

          const data = await response.json();

          store.dispatch('User/SET_GROUP_ID', state.groupId);

          localStorage.setItem(store.getters['User/GET_JWT_LKEY'], data.accessToken);
          let expirationDate = new Date(data.expirationDate);
          expirationDate.setDate(expirationDate.getDate() - 1);
          localStorage.setItem(store.getters['User/GET_EXPIRATION_DATE_KEY'], expirationDate);

          state.isTheGroupFirstYear = state.firstYearGroupIds.includes(state.groupId);
          state.isTheGroupSecondYear = state.secondYearGroupIds.includes(state.groupId);

          store.dispatch('Timetable/CLEAR_TIMETABLE');
          store.dispatch('Timetable/SET_ARE_UNMARKED_DATES_LOADED', false);
          await store.dispatch('Timetable/DOWNLOAD_UNMARKED_DATES');
          store.dispatch('Statistics/CLEAR_SUBJECTS_LIST');
          store.dispatch('Statistics/CLEAR_STATISTICS');

          ElMessage.success({ message: 'Group has been successfully changed.', showClose: true });
        } else {
          state.groupId = store.getters['User/GET_GROUP_ID'];
          ElMessage.error({ message: 'Some error has occured. Please try again later.', showClose: true });
        }
      } catch {
        state.groupId = store.getters['User/GET_GROUP_ID'];
        ElMessage.error({ message: 'Some error has occured. Please try again later.', showClose: true });
      } finally {
        state.groupLoadingBtn = false;
      }
    }

    async function changeSubgroups() {
      if (
        state.languageSubgroup == store.getters['User/GET_LANGUAGE_SUBGROUP'] &&
        state.facultySubgroup == store.getters['User/GET_FACULTY_SUBGROUP']
      ) {
        return ElMessage.warning({ message: 'Change at least 1 subgroup to proceed.', showClose: true });
      }
      state.subgroupLoadingBtn = true;

      const token = localStorage.getItem(store.getters['User/GET_JWT_LKEY']);

      try {
        const response = await fetch(store.getters['GET_URL'] + '/users/change-subgroups', {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            newLanguageSubgroup: Number(state.languageSubgroup),
            newFacultySubgroup: Number(state.facultySubgroup)
          })
        });

        if (response.status === 200) {
          store.dispatch('User/SET_LANGUAGE_SUBGROUP', state.languageSubgroup);
          store.dispatch('User/SET_FACULTY_SUBGROUP', state.facultySubgroup);

          store.dispatch('Timetable/CLEAR_TIMETABLE');
          store.dispatch('Timetable/SET_ARE_UNMARKED_DATES_LOADED', false);
          await store.dispatch('Timetable/DOWNLOAD_UNMARKED_DATES');
          store.dispatch('Statistics/CLEAR_STATISTICS');

          ElMessage.success({ message: 'Subgroups have been successfully changed.', showClose: true });
        } else {
          state.languageSubgroup == store.getters['User/GET_LANGUAGE_SUBGROUP'];
          state.facultySubgroup == store.getters['User/GET_FACULTY_SUBGROUP'];
          ElMessage.error({ message: 'Some error has occured. Please try again later.', showClose: true });
        }
      } catch {
        state.languageSubgroup == store.getters['User/GET_LANGUAGE_SUBGROUP'];
        state.facultySubgroup == store.getters['User/GET_FACULTY_SUBGROUP'];
        ElMessage.error({ message: 'Some error has occured. Please try again later.', showClose: true });
      } finally {
        state.subgroupLoadingBtn = false;
      }
    }

    async function logout() {
      localStorage.removeItem(store.getters['User/GET_JWT_LKEY']);
      localStorage.removeItem(store.getters['User/GET_EXPIRATION_DATE_KEY']);

      store.dispatch('User/SET_SIGNED_IN', false);
      store.dispatch('User/SET_USER_ID', undefined);
      store.dispatch('User/SET_FIRSTNAME', undefined);
      store.dispatch('User/SET_LASTNAME', undefined);
      store.dispatch('User/SET_EMAIL', undefined);
      store.dispatch('User/SET_GROUP_ID', undefined);
      store.dispatch('User/SET_LANGUAGE_SUBGROUP', undefined);
      store.dispatch('User/SET_FACULTY_SUBGROUP', undefined);

      store.dispatch('Timetable/CLEAR_TIMETABLE');
      store.dispatch('Timetable/SET_ARE_UNMARKED_DATES_LOADED', false);
      store.dispatch('Timetable/SET_UNMARKED_DATES', []);
      store.dispatch('Statistics/CLEAR_STATISTICS');
      store.dispatch('Statistics/CLEAR_SUBJECTS_LIST');

      mixpanel.reset();

      ElMessage.success({ message: "You've successfully logged out.", showClose: true });
      router.push('/');
    }

    return { state, logout, store, changeGroup, changeSubgroups, subgroupForFirstYearStudents, L1_LANGUAGE_GROUPS };
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/settings.scss';
@import '@/assets/styles/buttons.scss';
</style>
