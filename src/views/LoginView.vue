<template>
  <div class="sign-in-background"></div>
  <RouterLink to="/" class="go-back">
    <img src="@/assets/images/arrow-left.png" alt="Left Arrow" />
    <p>Go Back</p>
  </RouterLink>
  <div class="sign-in-block">
    <div class="sign-header">
      <img src="@/assets/images/logo-transparent.png" alt="Attendance Recorder Logo" />
      <h1 class="logo-text">SkipSmart</h1>
    </div>
    <el-form :model="state.form" status-icon :rules="state.formRules" label-position="top" class="sign-form">
      <el-form-item label="Username" prop="username">
        <el-input v-model="state.form.username" placeholder="Username" :prefix-icon="User" size="large" clearable />
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input v-model="state.form.password" placeholder="Password" :prefix-icon="Lock" size="large" show-password clearable />
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="sumbitSignInForm()" :loading="state.loadingBtn" id="sign-in-button">Sign In</el-button>
    <div class="sign-link">
      <span>Don't have an account?</span>
      <RouterLink to="/register">Sign Up Now</RouterLink>
    </div>
  </div>
  <img src="@/assets/images/cat_for_background.svg" alt="Background Image" class="sign-background-image-cat" />
</template>

<script>
import { isUsernameValid, usernameValidator, isPasswordValid, passwordValidator } from '@/assets/js/validators/userValidators.js';
import { User, Lock } from '@element-plus/icons-vue';
import { reactive, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import App from '@/App.vue';

export default {
  name: 'LoginView',

  setup() {
    const store = useStore();
    const router = useRouter();
    const toast = useToast();
    const { appMounted } = App.setup();

    const state = reactive({
      form: {
        username: '',
        password: ''
      },
      formRules: {
        username: [{ validator: usernameValidator, trigger: 'blur' }],
        password: [{ validator: passwordValidator, trigger: 'blur' }]
      },
      loadingBtn: false
    });

    watch(appMounted, (appMounted) => {
      if (appMounted) {
        if (store.getters['User/GET_IS_SIGNED_IN']) {
          toast.info("You're already signed in.");
          router.push('/');
        }
      }
    });

    function sumbitSignInForm() {
      if (isUsernameValid && isPasswordValid) {
        signIn();
      } else {
        toast.warning('Fill all the fields correctly!');
      }
    }

    async function signIn() {
      state.loadingBtn = true;

      const response = await fetch(store.getters['GET_URL'] + '/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(state.form)
      });

      if (response.status === 200) {
        const data = await response.json();

        store.dispatch('User/SET_SIGNED_IN', true);
        store.dispatch('User/SET_USERNAME', data.student.username);
        store.dispatch('User/SET_GROUP', data.student.group_number);
        store.dispatch('User/SET_TERM', data.student.term_number);
        localStorage.setItem(store.getters['User/GET_JWT_KEY'], data.token);
        let expireDate = new Date(data.expireDate);
        expireDate.setHours(expireDate.getHours() - 3);
        localStorage.setItem(store.getters['User/GET_EXPIRE_DATE_KEY'], expireDate);

        state.loadingBtn = false;
        toast.success(data.msg);
        router.push('/');
      } else if (response.status === 500) {
        state.loadingBtn = false;
        return toast.error('Sorry. We have got some server errors. Please try again later.');
      } else if (response.status === 401) {
        state.loadingBtn = false;
        return toast.error('Password or Username is not correct.');
      } else {
        state.loadingBtn = false;
        return toast.error('Some error has occured. Please try again later.');
      }
    }

    return { state, sumbitSignInForm, User, Lock };
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/login.scss';
</style>
