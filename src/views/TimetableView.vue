<template>
  <NavBar />
  <div class="container">
    <div class="timetable-date-container">
      <div class="timetable-date">{{ dateToString(state.date) }}</div>
    </div>
    <br />
    <div
      v-loading="state.loadingData"
      v-for="subject in state.timetable"
      :key="subject.period"
      class="timetable-row"
      :class="{
        'attended-lesson': state.timetable.find((lesson) => lesson.period == subject.period)?.attended ?? false,
        'skipped-lesson': state.timetable.find((lesson) => lesson.period == subject.period)?.attended === false ?? false
      }"
    >
      <div class="timetable-row-number">{{ subject.period }}</div>
      <div class="timetable-row-subject">{{ subject.subject }}</div>
      <div class="timetable-row-group">{{ subject.group }}</div>
      <div class="timetable-row-buttons">
        <el-button size="large" type="success" :icon="Check" circle @click="addSubjectToForm(subject.period, true)" />
        <el-button size="large" type="danger" :icon="Close" circle @click="addSubjectToForm(subject.period, false)" />
      </div>
    </div>

    <el-button
      size="large"
      round
      type="primary"
      :icon="Upload"
      :loading="state.buttonLoading"
      class="upload-button"
      :disabled="state.buttonDisabled"
      @click="updateAttendance()"
    >
      Update
    </el-button>
  </div>
</template>

<script>
import { watch, reactive } from 'vue';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import NavBar from '@/components/NavBar.vue';
import dateToString from '@/assets/js/dateToString';
import App from '@/App.vue';
import { Check, Close, Upload } from '@element-plus/icons-vue';

export default {
  name: 'TimetableView',
  components: { NavBar },

  setup() {
    const store = useStore();
    const router = useRouter();
    const toast = useToast();
    const { appMounted } = App.setup();

    const state = reactive({
      loadingData: true,
      buttonLoading: false,
      buttonDisabled: true,
      date: new Date('2024-02-07'),
      timetable: [
        {
          period: 1,
          subject: 'UE000 Subject',
          group: ''
        },
        {
          period: 2,
          subject: 'UE000 Subject',
          group: ''
        },
        {
          period: 3,
          subject: 'UE000 Subject / PW',
          group: `Group ${store.getters['User/GET_GROUP']}`
        },
        {
          period: 4,
          subject: 'UE000 Subject',
          group: ''
        }
      ],
      form: {
        lessons: []
      }
    });

    watch(appMounted, (appMounted) => {
      if (appMounted) {
        if (!store.getters['User/GET_IS_SIGNED_IN']) {
          toast.info('You need to be signed in to access this page.');
          router.push('/');
        } else {
          getTimetable();
        }
      }
    });

    function addSubjectToForm(period, attended) {
      let lessonInTimetable = state.timetable.find((subject) => subject.period == period);
      let lessonInLessons = state.form.lessons.find((subject) => subject.period == period);

      if (!lessonInLessons) {
        state.form.lessons.push({
          course: lessonInTimetable.subject,
          attended,
          period: +lessonInTimetable.period
        });
      } else {
        lessonInLessons.attended = attended;
      }
      lessonInTimetable.attended = attended;
    }

    async function getTimetable() {
      const date = dateToString(state.date);
      const token = localStorage.getItem(store.getters['User/GET_JWT_KEY']);

      const response = await fetch(store.getters['GET_URL'] + `/timetable/${date}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        const data = await response.json();
        const myGroup = store.getters['User/GET_GROUP'];
        state.timetable = data.lessons;
        state.timetable = state.timetable.filter((subject) => !subject.group || subject.group.includes(myGroup));
        state.loadingData = false;
        state.buttonDisabled = false;
      } else if (response.status === 500) {
        state.loadingData = false;
        return toast.error('Sorry. We have got some server errors. Please try again later.');
      } else {
        state.loadingData = false;
        return toast.error('Some error has occured. Please try again later.');
      }
    }

    async function updateAttendance() {
      if (state.form.lessons.length == 0) {
        return toast.warning('Change attendance status of at least one subject.');
      }

      state.buttonLoading = true;
      state.form.date = dateToString(state.date);
      const token = localStorage.getItem(store.getters['User/GET_JWT_KEY']);

      const response = await fetch(store.getters['GET_URL'] + '/attendance', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(state.form)
      });

      if (response.status === 200) {
        const data = await response.json();
        state.buttonLoading = false;
        state.form = { lessons: [] };
        toast.success(data.msg);
      } else if (response.status === 500) {
        state.buttonLoading = false;
        return toast.error('Sorry. We have got some server errors. Please try again later.');
      } else {
        state.buttonLoading = false;
        return toast.error('Some error has occured. Please try again later.');
      }
    }

    return { state, dateToString, Check, Close, Upload, addSubjectToForm, updateAttendance };
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/timetable.scss';
</style>
