<template>
  <div class="timetable">
    <h1 class="site-title">
      <img src="../assets/images/logo-transparent.png" /><span class="logo-text">SkipSmart</span> - Timetable
    </h1>

    <div class="timetable-date-container">
      <el-date-picker
        v-model="timetableDate"
        type="date"
        placeholder="Pick a day"
        format="DD/MM/YYYY"
        :disabled-date="isDateDisabled"
        :cell-class-name="isDateUnfilled"
        :prefix-icon="ArrowDownBold"
        :editable="false"
        :clearable="false"
      />
    </div>
    <div class="container" style="margin-bottom: 100px">
      <br />
      <div
        v-loading="state.loadingData"
        v-for="subject in state.timetable.lessons"
        :key="subject.period"
        class="timetable-row"
        :class="{
          'attended-lesson': state.timetable.lessons.find((lesson) => lesson.period == subject.period)?.attended ?? false,
          'skipped-lesson': state.timetable.lessons.find((lesson) => lesson.period == subject.period)?.attended === false ?? false
        }"
      >
        <div class="timetable-row-number">{{ subject.period }}</div>
        <div class="timetable-row-subject">{{ subject.course }}</div>
        <div class="timetable-row-group">{{ subject.group }}</div>
        <div class="timetable-row-buttons">
          <el-button size="large" type="success" :icon="Check" circle @click="updateAttendance(subject.period, true)" />
          <el-button size="large" type="danger" :icon="Close" circle @click="updateAttendance(subject.period, false)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { watch, reactive, ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import dateToString from '@/assets/js/dateToString';
import App from '@/App.vue';
import { Check, Close, Upload, ArrowDownBold } from '@element-plus/icons-vue';

export default {
  name: 'TimetableView',

  setup() {
    const store = useStore();
    const router = useRouter();
    const toast = useToast();
    const { appMounted } = App.setup();

    const timetableDate = ref(store.getters['Timetable/GET_DATE']);
    const state = reactive({
      loadingData: true,
      isAttendanceChanged: false,
      isDateUpdated: false,
      timetable: {
        lessons: [
          {
            period: 1,
            course: 'UE000 Subject',
            group: ''
          },
          {
            period: 2,
            course: 'UE000 Subject',
            group: ''
          },
          {
            period: 3,
            course: 'UE000 Subject',
            group: ''
          },
          {
            period: 4,
            course: 'UE000 Subject',
            group: ''
          }
        ]
      }
    });

    watch(appMounted, (appMounted) => {
      if (appMounted) {
        if (!store.getters['User/GET_IS_SIGNED_IN']) {
          toast.info('You need to be signed in to access this page.');
          router.push('/');
        } else {
          getTimetable();
          store.dispatch('Timetable/DOWNLOAD_UNMARKED_DATES');
        }
      }
    });

    watch(timetableDate, (newDate) => {
      store.dispatch('Timetable/SET_DATE', newDate);
      state.isDateUpdated = true;
      getTimetable();
    });

    onMounted(() => {
      // Load timetable from VueX if there is one
      if (store.getters['Timetable/GET_TIMETABLE']?.lessons.length !== 0) {
        state.timetable = store.getters['Timetable/GET_TIMETABLE'];
        state.loadingData = false;
      }
    });

    async function getTimetable() {
      if (store.getters['Timetable/GET_TIMETABLE']?.lessons.length !== 0 && !state.isDateUpdated) return;

      state.loadingData = true;

      if (state.timetable.lessons.length === 0) {
        state.timetable = {
          lessons: [
            {
              period: 1,
              course: 'UE000 Subject',
              group: ''
            }
          ]
        };
      }

      const date = dateToString(timetableDate.value);
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

        state.timetable.lessons = data.lessons;
        state.timetable.lessons = state.timetable.lessons.filter((subject) => !subject.group || subject.group.includes(myGroup));

        store.dispatch('Timetable/SET_TIMETABLE', state.timetable);
        state.isDateUpdated = false;

        state.isAttendanceChanged = false;

        state.loadingData = false;
      } else if (response.status === 500) {
        state.loadingData = false;
        // return toast.error('Sorry. We have got some server errors. Please try again later.');
        return;
      } else {
        state.loadingData = false;
        // return toast.error('Some error has occured. Please try again later.');
        return;
      }
    }

    async function updateAttendance(period, attended) {
      let lesson = state.timetable.lessons.find((subject) => subject.period == period);

      if (lesson.attended === attended) return;

      const lastLessonAttended = lesson.attended;
      lesson.attended = attended;

      let requestBody = { lessons: [lesson] };

      const token = localStorage.getItem(store.getters['User/GET_JWT_KEY']);

      let isDateMarked = true;
      for (let subject of state.timetable.lessons) {
        if (!(subject.attended === true || subject.attended === false)) {
          isDateMarked = false;
          break;
        }
      }

      requestBody.isDateMarked = isDateMarked;
      requestBody.date = dateToString(timetableDate.value);

      const response = await fetch(store.getters['GET_URL'] + '/attendance', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.status === 200) {
        store.dispatch('Statistics/SET_IS_TIMETABLE_UPDATED', true);
        
        // const data = await response.json();

        store.dispatch('Timetable/SET_TIMETABLE', state.timetable);

        // toast.success(data.msg);

        if (isDateMarked) {
          let markedDate = new Date(dateToString(timetableDate.value));
          markedDate = markedDate.toISOString();
          store.dispatch('Timetable/REMOVE_MARKED_DATE', markedDate);
        }
      } else if (response.status === 500) {
        lesson.attended = lastLessonAttended;
        // return toast.error('Sorry. We have got some server errors. Please try again later.');
        return;
      } else {
        lesson.attended = lastLessonAttended;
        // return toast.error('Some error has occured. Please try again later.');
        return;
      }
    }

    function isDateDisabled(date) {
      // ! Change the date
      if (date > new Date() || date < new Date(2024, 0, 29, 0, 0, 0)) {
        return true;
      } else {
        return false;
      }
    }

    const isDateUnfilled = (date) => {
      const unmarkedDates = store.getters['Timetable/GET_UNMARKED_DATES'];
      date.setUTCHours(0);
      date.setDate(date.getDate() + 1);
      if (unmarkedDates.includes(date.toISOString())) {
        return 'red-marked-date';
      }
    };

    return {
      state,
      timetableDate,
      dateToString,
      Check,
      Close,
      Upload,
      updateAttendance,
      isDateDisabled,
      isDateUnfilled,
      ArrowDownBold,
      store
    };
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/timetable.scss';
</style>
