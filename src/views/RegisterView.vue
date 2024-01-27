<template>
  <div class="sign-up-background"></div>
  <RouterLink to="/" class="go-back">
    <img src="@/assets/images/arrow-left.png" alt="Left Arrow" />
    <p>Go Back</p>
  </RouterLink>
  <div class="sign-up-block">
    <div class="sign-header">
      <div class="sign-header-logo">
        <img src="@/assets/images/logo-transparent.png" alt="Attendance Recorder Logo" />
        <p class="logo-text">SkipSmart</p>
      </div>
      <h1>Sign Up</h1>
    </div>
    <el-form :model="state.form" status-icon :rules="state.formRules" label-position="top" class="sign-form">
      <el-form-item label="Username (Your Edupage username)" prop="username">
        <el-input v-model="state.form.username" placeholder="Username" :prefix-icon="User" size="large" clearable />
      </el-form-item>
      <el-form-item label="Password (Your Edupage password)" prop="password">
        <el-input v-model="state.form.password" placeholder="Password" :prefix-icon="Lock" size="large" show-password clearable />
      </el-form-item>
      <el-form-item label="Group" prop="group" size="large">
        <el-select v-model="state.form.group" placeholder="Subgroup Number" default="1">
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
    <el-button type="primary" @click="sumbitSignUpForm()" :loading="state.loadingBtn" id="sign-up-button">Sign Up</el-button>
    <div class="sign-link">
      <span>Already have an account?</span>
      <RouterLink to="/login">Login</RouterLink>
    </div>
  </div>
</template>

<script>
import { isUsernameValid, usernameValidator, isPasswordValid, passwordValidator } from '@/assets/js/validators/userValidators.js';
import { User, Lock } from '@element-plus/icons-vue';
import { watch, reactive } from 'vue';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import App from '@/App.vue';

export default {
  name: 'RegisterView',

  setup() {
    const store = useStore();
    const router = useRouter();
    const toast = useToast();
    const { appMounted } = App.setup();

    const state = reactive({
      form: {
        username: '',
        password: '',
        group: undefined,
        term: 2
      },
      formRules: {
        username: [{ validator: usernameValidator, trigger: 'blur' }],
        password: [{ validator: passwordValidator, trigger: 'blur' }],
        group: [{ required: true, message: 'Please select a group number', trigger: 'blur' }],
        term: [{ required: true, message: 'Please select a term number', trigger: 'blur' }]
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

    function sumbitSignUpForm() {
      if (isUsernameValid && isPasswordValid) {
        signUp();
      } else {
        toast.warning('Fill all the fields correctly!');
      }
    }

    async function signUp() {
      state.loadingBtn = true;

      state.form.group = Number(state.form.group);
      state.form.term = Number(state.form.term);

      const response = await fetch(store.getters['GET_URL'] + '/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(state.form)
      });

      const data = await response.json();

      if (response.status === 201) {
        store.dispatch('User/SET_SIGNED_IN', true);
        store.dispatch('User/SET_USERNAME', data.student.username);
        store.dispatch('User/SET_GROUP', data.student.group_number);
        store.dispatch('User/SET_TERM', data.student.term_number);
        localStorage.setItem(store.getters['User/GET_JWT_KEY'], data.token);
        let expireDate = new Date(data.expireDate);
        expireDate.setDate(expireDate.getDate() - 1);
        localStorage.setItem(store.getters['User/GET_EXPIRE_DATE_KEY'], expireDate);

        state.loadingBtn = false;
        toast.success(data.msg);
        router.push('/');
      } else if (response.status === 500) {
        state.loadingBtn = false;
        return toast.error('Sorry. We have got some server errors. Please try again later.');
      } else if ((response.status === 401 || response.status === 400) && data.msg) {
        state.loadingBtn = false;
        return toast.error(data.msg);
      } else if (response.status === 401) {
        state.loadingBtn = false;
        return toast.error('Failed to register.');
      } else {
        state.loadingBtn = false;
        return toast.error('Some error has occured. Please try again later.');
      }
    }

    return { state, sumbitSignUpForm, User, Lock };
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/register.scss';
</style>
