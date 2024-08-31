<template>
  <div class="sign-up-page">
    <div class="header">
      <RouterLink to="/">
        <div class="header-logo">
          <img src="../assets/images/logo-round-background.png" alt="SkipSmart Logo" />
          <span>SkipSmart</span>
        </div>
      </RouterLink>
      <div class="header-button">
        <RouterLink to="/login"><el-button>Log in</el-button></RouterLink>
      </div>
    </div>
    <div class="slide" v-if="state.showFirstSlide">
      <div class="container">
        <h1>Create your account!</h1>

        <el-form :model="state.form" status-icon :rules="state.formRules" label-position="top">
          <el-form-item label="First Name" prop="firstName">
            <el-input v-model="state.form.firstName" placeholder="First name" size="large" clearable />
          </el-form-item>
          <el-form-item label="Last Name" prop="lastName">
            <el-input v-model="state.form.lastName" placeholder="Last name" size="large" clearable />
          </el-form-item>
          <el-form-item label="UFAZ Email" prop="email">
            <el-input v-model="state.form.email" placeholder="UFAZ Email" size="large" clearable />
          </el-form-item>
        </el-form>

        <a href="#"><button class="scale-button" @click="showTheSecondSlide">Continue</button></a>

        <div class="other-option">
          <hr />
          <p>Already have an account? <RouterLink to="/login">Log In</RouterLink></p>
        </div>
      </div>
    </div>

    <div class="slide" v-if="state.showSecondSlide">
      <div class="container">
        <div class="slide-header">
          <img src="../assets/images/arrow-left.png" alt="Arrow Left Image" @click="showTheFirstSlide" />
          <h1>Create your account!</h1>
        </div>

        <el-form :model="state.form" status-icon :rules="state.formRules" label-position="top">
          <el-form-item label="Group">
            <el-select v-model="state.form.groupId" placeholder="Group">
              <el-option
                v-for="group in state.groups"
                v-bind:key="group.id"
                :label="group.groupName"
                :value="group.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <a href="#"><button class="scale-button" @click="showTheThirdSlide">Continue</button></a>

        <div class="other-option">
          <hr />
          <p>Already have an account? <RouterLink to="/login">Log In</RouterLink></p>
        </div>
      </div>
    </div>

    <div class="slide" v-if="state.showThirdSlide">
      <div class="container">
        <div class="slide-header">
          <img src="../assets/images/arrow-left.png" alt="Arrow Left Image" @click="showTheSecondSlide" />
          <h1>Create your account!</h1>
        </div>

        <el-form
          :model="state.form"
          status-icon
          :rules="state.formRules"
          label-position="top"
          v-if="!state.isTheGroupFirstYear && !state.isTheGroupSecondYear"
        >
          <el-form-item label="Language Subgroup">
            <el-select v-model="state.form.languageSubgroup" placeholder="Language Subgroup">
              <el-option label="1" value="1"></el-option>
              <el-option label="2" value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="Faculty Subgroup (Choose the same as Language Subgroup if you don't know)">
            <el-select v-model="state.form.facultySubgroup" placeholder="Faculty Subgroup">
              <el-option label="1" value="1"></el-option>
              <el-option label="2" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <el-form :model="state.form" status-icon :rules="state.formRules" label-position="top" v-if="state.isTheGroupSecondYear">
          <el-form-item label="Language Subgroup Teacher">
            <el-select v-model="state.form.languageSubgroup" placeholder="Language Subgroup Teacher">
              <el-option
                v-for="l1_group in L1_LANGUAGE_GROUPS"
                :key="l1_group.group"
                :label="l1_group.teacher + ' - ' + l1_group.language"
                :value="l1_group.group"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="Faculty Subgroup">
            <el-select v-model="state.form.facultySubgroup" placeholder="Faculty Subgroup">
              <el-option label="1" value="1"></el-option>
              <el-option label="2" value="2"></el-option>
              <el-option label="3" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <el-form :model="state.form" status-icon :rules="state.formRules" label-position="top" v-if="state.isTheGroupFirstYear">
          <el-form-item label="Subgroup">
            <el-select v-model="subgroupForFirstYearStudents" placeholder="Subgroup">
              <el-option label="1" value="1"></el-option>
              <el-option label="2" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <a href="#"><button class="scale-button" @click="showTheFourthSlide">Continue</button></a>

        <div class="other-option">
          <hr />
          <p>Already have an account? <RouterLink to="/login">Log In</RouterLink></p>
        </div>
      </div>
    </div>

    <div class="slide" v-if="state.showFourthSlide">
      <div class="container">
        <div class="slide-header">
          <img src="../assets/images/arrow-left.png" alt="Arrow Left Image" @click="showTheThirdSlide" />
          <h1>Create your account!</h1>
        </div>

        <el-form :model="state.form" status-icon :rules="state.formRules" label-position="top">
          <el-form-item label="Password" prop="password">
            <el-input v-model="state.form.password" placeholder="Password" size="large" clearable type="password" show-password />
          </el-form-item>
        </el-form>

        <el-button @click="sumbitSignUpForm" :loading="state.loadingBtn">Sign Up</el-button>

        <div class="warning">
          <p>
            By signing up, you understand and accept that SkipSmart doesn't take any responsibility for the attendance. You are
            the only one who is responsible for your attendance.
          </p>
        </div>

        <div class="other-option">
          <hr />
          <p>Already have an account? <RouterLink to="/login">Log In</RouterLink></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  isFirstNameValid,
  firstNameValidator,
  isLastNameValid,
  lastNameValidator,
  isPasswordValid,
  passwordValidator,
  isEmailValid,
  ufazEmailValidator
} from '@/assets/js/validators/userValidators.js';
import { User, Lock } from '@element-plus/icons-vue';
import { watch, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import App from '@/App.vue';
import { ElMessage } from 'element-plus';
import uuidv4 from '@/assets/js/randomUUID';
import L1_LANGUAGE_GROUPS from '@/assets/js/l1-language-teachers';
import mixpanel from 'mixpanel-browser';

export default {
  name: 'RegisterView',

  setup() {
    const store = useStore();
    const router = useRouter();
    const { appMounted } = App.setup();

    const state = reactive({
      form: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        groupId: undefined,
        languageSubgroup: undefined,
        facultySubgroup: undefined
      },
      formRules: {
        firstName: [{ validator: firstNameValidator, trigger: 'blur' }],
        lastName: [{ validator: lastNameValidator, trigger: 'blur' }],
        email: [{ validator: ufazEmailValidator, trigger: 'blur' }],
        password: [{ validator: passwordValidator, trigger: 'blur' }]
      },
      loadingBtn: false,
      showFirstSlide: true,
      showSecondSlide: false,
      showThirdSlide: false,
      showFourthSlide: false,
      isTheGroupFirstYear: false,
      isTheGroupSecondYear: false,
      groups: []
    });

    watch(appMounted, async (appMounted) => {
      if (appMounted) {
        if (store.getters['User/GET_IS_SIGNED_IN']) {
          ElMessage.info({ message: 'You are already signed in.', showClose: true });
          router.push('/');
        } else {
          try {
            const response = await fetch(store.getters['GET_URL'] + '/groups/all', {
              method: 'GET'
            });

            const groups = await response.json();

            if (response.status === 200) {
              state.groups = groups.sort((a, b) => a.groupName.localeCompare(b.groupName));
            } else {
              ElMessage.error({ message: 'Server Error. Failed to fetch groups. Please try again later.', showClose: true });
              router.push('/');
            }
          } catch {
            ElMessage.error({ message: 'Server Error. Failed to fetch groups. Please try again later.', showClose: true });
            router.push('/');
          }
        }
      }
    });

    function showTheFirstSlide() {
      state.showFirstSlide = true;
      state.showSecondSlide = false;
      state.showThirdSlide = false;
      state.showFourthSlide = false;
    }

    function showTheSecondSlide() {
      if (isFirstNameValid && isLastNameValid && isEmailValid) {
        state.showFirstSlide = false;
        state.showSecondSlide = true;
        state.showThirdSlide = false;
        state.showFourthSlide = false;
      } else {
        ElMessage.warning({ message: 'Fill all the fields correctly!', showClose: true });
      }
    }

    const subgroupForFirstYearStudents = computed({
      get() {
        return state.form.languageSubgroup;
      },
      set(value) {
        state.form.languageSubgroup = value;
        state.form.facultySubgroup = value;
      }
    });

    function showTheThirdSlide() {
      if (state.form.groupId) {
        let firstYearGroupIds = state.groups.slice(0, 5).map((group) => group.id);

        if (firstYearGroupIds.includes(state.form.groupId)) {
          state.isTheGroupFirstYear = true;
        } else {
          state.isTheGroupFirstYear = false;
        }

        let secondYearGroupIds = state.groups.slice(5, 10).map((group) => group.id);

        if (secondYearGroupIds.includes(state.form.groupId)) {
          state.isTheGroupSecondYear = true;
        } else {
          state.isTheGroupSecondYear = false;
        }

        state.showFirstSlide = false;
        state.showSecondSlide = false;
        state.showThirdSlide = true;
        state.showFourthSlide = false;
      } else {
        ElMessage.warning({ message: 'Choose a group!', showClose: true });
      }
    }

    function showTheFourthSlide() {
      if (state.form.languageSubgroup && state.form.facultySubgroup) {
        state.showFirstSlide = false;
        state.showSecondSlide = false;
        state.showThirdSlide = false;
        state.showFourthSlide = true;
      } else {
        ElMessage.warning({ message: 'Choose a subgroup!', showClose: true });
      }
    }

    function sumbitSignUpForm() {
      if (
        isFirstNameValid &&
        isLastNameValid &&
        isEmailValid &&
        isPasswordValid &&
        state.form.groupId &&
        state.form.languageSubgroup &&
        state.form.facultySubgroup
      ) {
        signUp();
      } else {
        ElMessage.warning({ message: 'Fill all the fields correctly!', showClose: true });
      }
    }

    async function signUp() {
      state.loadingBtn = true;

      state.form.languageSubgroup = Number(state.form.languageSubgroup);
      state.form.facultySubgroup = Number(state.form.facultySubgroup);
      state.form.email = state.form.email.toLowerCase().trim();
      state.form.firstName = state.form.firstName.trim();
      state.form.lastName = state.form.lastName.trim();
      state.form.userId = uuidv4();

      try {
        const response = await fetch(store.getters['GET_URL'] + '/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(state.form)
        });

        const data = await response.json();

        if (response.status === 200) {
          store.dispatch('User/SET_SIGNED_IN', true);
          store.dispatch('User/SET_USER_ID', state.form.userId);
          store.dispatch('User/SET_FIRSTNAME', state.form.firstName);
          store.dispatch('User/SET_LASTNAME', state.form.lastName);
          store.dispatch('User/SET_EMAIL', state.form.email);
          store.dispatch('User/SET_GROUP_ID', state.form.groupId);
          store.dispatch('User/SET_LANGUAGE_SUBGROUP', state.form.languageSubgroup);
          store.dispatch('User/SET_FACULTY_SUBGROUP', state.form.facultySubgroup);

          mixpanel.identify(state.form.userId);

          mixpanel.people.set({
            $name: `${state.form.firstName} ${state.form.lastName}`,
            $email: state.form.email
          });

          mixpanel.track('Sign Up', {
            'First Name': state.form.firstName,
            'Last Name': state.form.lastName,
            Email: state.form.email,
            'Group ID': state.form.groupId,
            'Group Name': state.groups.find((group) => group.id === state.form.groupId).groupName
          });

          localStorage.setItem(store.getters['User/GET_JWT_LKEY'], data.accessToken);

          let expirationDate = new Date(data.expirationDate);
          expirationDate.setDate(expirationDate.getDate() - 1);
          localStorage.setItem(store.getters['User/GET_EXPIRATION_DATE_KEY'], expirationDate);

          state.loadingBtn = false;
          ElMessage.success({ message: 'You have successfully signed up!', showClose: true });
          router.push('/');
        } else if (response.status === 400 && data.code === 'User.EmailIsAlreadyTaken') {
          state.loadingBtn = false;
          return ElMessage.error({ message: `${data.name}`, showClose: true });
        } else if (response.status === 500) {
          state.loadingBtn = false;
          router.push('/');
          return ElMessage.error({ message: 'Sorry. We have got some server errors. Please try again later.', showClose: true });
        } else {
          state.loadingBtn = false;
          router.push('/');
          return ElMessage.error({ message: 'Some error has occured. Please try again later.', showClose: true });
        }
      } catch (error) {
        state.loadingBtn = false;
        router.push('/');
        return ElMessage.error({ message: 'Some error has occured. Please try again later.', showClose: true });
      }
    }

    return {
      state,
      sumbitSignUpForm,
      User,
      Lock,
      showTheSecondSlide,
      showTheFirstSlide,
      showTheThirdSlide,
      showTheFourthSlide,
      subgroupForFirstYearStudents,
      L1_LANGUAGE_GROUPS
    };
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/register.scss';
@import '@/assets/styles/buttons.scss';
</style>
