<template>
  <div class="login-page">
    <div class="header">
      <RouterLink to="/">
        <div class="header-logo">
          <img src="../assets/images/logo-round-background.png" alt="SkipSmart Logo" />
          <span>SkipSmart</span>
        </div>
      </RouterLink>
      <div class="header-button">
        <RouterLink to="/register"><el-button>Sign Up</el-button></RouterLink>
      </div>
    </div>

    <div class="slide">
      <div class="container">
        <h1>Welcome Back!</h1>

        <el-form :model="state.form" status-icon :rules="state.formRules" label-position="top">
          <el-form-item label="Email" prop="email">
            <el-input v-model="state.form.email" placeholder="Email" size="large" clearable />
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input v-model="state.form.password" placeholder="Password" size="large" clearable type="password" show-password />
          </el-form-item>
        </el-form>

        <el-button @click="sumbitSignInForm" :loading="state.loadingBtn">Log In</el-button>

        <div class="other-option">
          <hr />
          <p>Still haven't made an account? <RouterLink to="/register">Sign Up</RouterLink></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isEmailValid, isPasswordValid, passwordValidator, ufazEmailValidator } from '@/assets/js/validators/userValidators.js';
import { User, Lock } from '@element-plus/icons-vue';
import { reactive, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import App from '@/App.vue';
import { ElMessage } from 'element-plus';
import mixpanel from 'mixpanel-browser';

export default {
  name: 'LoginView',

  setup() {
    const store = useStore();
    const router = useRouter();
    const { appMounted } = App.setup();

    const state = reactive({
      form: {
        email: '',
        password: ''
      },
      formRules: {
        email: [{ validator: ufazEmailValidator, trigger: 'blur' }],
        password: [{ validator: passwordValidator, trigger: 'blur' }]
      },
      loadingBtn: false
    });

    watch(appMounted, (appMounted) => {
      if (appMounted) {
        if (store.getters['User/GET_IS_SIGNED_IN']) {
          ElMessage.info({ message: 'You are already signed in.', showClose: true });
          router.push('/');
        }
      }
    });

    function sumbitSignInForm() {
      if (isEmailValid && isPasswordValid) {
        signIn();
      } else {
        ElMessage.warning({ message: 'Fill all the fields correctly!', showClose: true });
      }
    }

    async function signIn() {
      state.loadingBtn = true;

      state.form.email = state.form.email.toLowerCase().trim();

      try {
        const loginResponse = await fetch(store.getters['GET_URL'] + '/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(state.form)
        });

        if (loginResponse.status === 200) {
          const loginData = await loginResponse.json();

          const getMeResponse = await fetch(store.getters['GET_URL'] + '/users/me', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${loginData.accessToken}`
            }
          });

          if (getMeResponse.status === 200) {
            const userData = await getMeResponse.json();

            store.dispatch('User/SET_SIGNED_IN', true);
            store.dispatch('User/SET_USER_ID', userData.id);
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

            localStorage.setItem(store.getters['User/GET_JWT_LKEY'], loginData.accessToken);
            let expirationDate = new Date(loginData.expirationDate);
            expirationDate.setDate(expirationDate.getDate() - 1);
            localStorage.setItem(store.getters['User/GET_EXPIRATION_DATE_KEY'], expirationDate);

            state.loadingBtn = false;
            ElMessage.success({ message: 'You have successfully signed in!', showClose: true });
            router.push('/');
          } else {
            state.loadingBtn = false;
            router.push('/');
            return ElMessage.error({ message: 'Some error has occured. Please try again later.', showClose: true });
          }
        } else if (loginResponse.status === 500) {
          state.loadingBtn = false;
          router.push('/');
          return ElMessage.error({ message: 'Sorry. We have got some server errors. Please try again later.', showClose: true });
        } else if (loginResponse.status === 401) {
          state.loadingBtn = false;
          return ElMessage.error({ message: 'The provided credentials are invalid.', showClose: true });
        } else {
          state.loadingBtn = false;
          return ElMessage.error({ message: 'Some error has occured. Please try again later.', showClose: true });
        }
      } catch {
        state.loadingBtn = false;
        router.push('/');
        return ElMessage.error({ message: 'Some error has occured. Please try again later.', showClose: true });
      }
    }

    return { state, sumbitSignInForm, User, Lock };
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/login.scss';
</style>
