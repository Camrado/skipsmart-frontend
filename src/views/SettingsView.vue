<template>
  <h1 class="site-title">
    <img src="../assets/images/logo-transparent.png" /><span class="logo-text">SkipSmart</span> - Settings
  </h1>
  <div class="settings container">
    <br /><br />
    <hr />
    <h1>User Data</h1>

    <el-result
      icon="warning"
      title="Warning Tip"
      sub-title="Please modify the data below only if it is genuinely incorrect. Otherwise, you will encounter issues."
    ></el-result>

    <div class="sign-container">
      <el-form :model="state.form" status-icon label-position="top" class="sign-form">
        <el-form-item label="Group" prop="group" size="large">
          <el-select v-model="state.form.group" placeholder="Group Number" default="1">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Term" prop="term" size="large">
          <el-select v-model="state.form.term" placeholder="Term Number" default="1">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="submitUpdate()" :loading="state.loadingBtn">Submit</el-button>
      <br /><br /><br /><br />
      <hr />
      <br /><br /><br />
      <el-button type="danger" @click="logout()" class="logout">Log Out</el-button>
    </div>
  </div>
</template>

<script>
import { reactive, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import App from '@/App.vue';

export default {
  name: 'SettingsView',

  setup() {
    const store = useStore();
    const router = useRouter();
    const toast = useToast();
    const { appMounted } = App.setup();

    const state = reactive({
      loadingBtn: false,
      form: {
        group: `${store.getters['User/GET_GROUP']}`,
        term: `${store.getters['User/GET_TERM']}`
      }
    });

    watch(appMounted, (appMounted) => {
      if (appMounted) {
        if (!store.getters['User/GET_IS_SIGNED_IN']) {
          toast.info('You need to be signed in to access this page.');
          router.push('/');
        }
      }
    });

    async function submitUpdate() {
      if (state.form.group == store.getters['User/GET_GROUP'] && state.form.term == store.getters['User/GET_TERM']) {
        return toast.warning('Change at least one field.');
      }
      state.loadingBtn = true;

      const requestBody = {};
      if (state.form.group != `${store.getters['User/GET_GROUP']}`) {
        requestBody.group = state.form.group;
      }
      if (state.form.term != `${store.getters['User/GET_TERM']}`) {
        requestBody.term = state.form.term;
      }

      const token = localStorage.getItem(store.getters['User/GET_JWT_KEY']);
      const response = await fetch(store.getters['GET_URL'] + '/student', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
        store.dispatch('User/SET_GROUP', data.student.group_number);
        store.dispatch('User/SET_TERM', data.student.term_number);

        if (data.token && data.expireDate) {
          localStorage.setItem(store.getters['User/GET_JWT_KEY'], data.token);
          let expireDate = new Date(data.expireDate);
          expireDate.setDate(expireDate.getDate() - 1);
          localStorage.setItem(store.getters['User/GET_EXPIRE_DATE_KEY'], expireDate);
        }

        toast.success(data.msg);
      } else {
        toast.error('Some error has occured. Please try again later.');
      }

      state.loadingBtn = false;
    }

    function logout() {
      localStorage.removeItem(store.getters['User/GET_JWT_KEY']);
      localStorage.removeItem(store.getters['User/GET_EXPIRE_DATE_KEY']);
      store.dispatch('User/SET_SIGNED_IN', false);
      store.dispatch('User/SET_USERNAME', undefined);
      store.dispatch('User/SET_GROUP', undefined);
      store.dispatch('User/SET_TERM', undefined);

      toast.success("You've successfully logged out.");
      router.push('/');
    }

    return { state, submitUpdate, logout };
  }
};
</script>

<style lang="scss">
.settings {
  min-height: 100vh;
  margin-bottom: 100px;

  h1 {
    margin-top: 20px;
    text-align: center;
    font-family: 'Poppins', sans-serif;
  }

  .el-result__title p {
    color: #fffffe;
  }

  .el-result__subtitle p {
    color: #b8c1ec;
  }

  .sign-form {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;

    .el-form-item__label {
      color: #abc5d1 !important;
      margin-left: 5px;
      margin-bottom: 5px !important;
    }

    .el-input__wrapper {
      padding: 5px 15px;
      font-size: 15px;
      border-radius: 50px !important;
    }

    .el-form-item__content {
      margin-bottom: 15px !important;
    }

    .el-form-item {
      width: 30%;
      display: inline-block;
    }

    .el-form-item:nth-child(2) {
      margin-left: 10%;
    }

    .el-select__wrapper {
      padding: 5px 15px !important;
      font-size: 15px;
      border-radius: 50px !important;
    }
  }

  .el-button {
    z-index: 2 !important;
    background-color: #eebbc3 !important;
    border-color: #eebbc3 !important;
    border-radius: 50px !important;
    padding: 20px 0;
    font-size: 20px;
    width: 70%;
    margin-left: 15%;
    font-weight: bolder;
    font-family: 'Nunito', sans-serif;
    color: #001e1d !important;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .logout {
    background-color: #e25d71 !important;
    border-color: #e25d71 !important;
  }
}
</style>
