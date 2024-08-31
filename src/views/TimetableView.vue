<template>
  <div class="timetable">
    <div class="header">
      <div class="header-logo">
        <img src="../assets/images/logo-round-background.png" alt="SkipSmart Logo" />
        <span>SkipSmart</span>
      </div>
      <div class="header-button"></div>
    </div>

    <div class="timetable-date-container">
      <div class="container">
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
    </div>

    <div class="container" style="margin-bottom: 100px">
      <br />
      <div
        v-loading="state.loadingData"
        v-for="subject in state.timetable.lessons"
        :key="subject.period"
        class="timetable-row-container"
      >
        <div
          class="timetable-row"
          :class="{
            'attended-lesson': state.timetable.lessons.find((lesson) => lesson.period == subject.period)?.hasAttended ?? false,
            'skipped-lesson':
              state.timetable.lessons.find((lesson) => lesson.period == subject.period)?.hasAttended === false ?? false
          }"
        >
          <div class="timetable-row-number">{{ subject.period }}</div>
          <div class="timetable-row-subject">{{ subject.courseName }}</div>
          <div class="timetable-row-group" v-if="subject.facultySubgroup !== 0 || subject.languageSubgroup !== 0">
            Group {{ subject.languageSubgroup === 0 ? subject.facultySubgroup : subject.languageSubgroup }}
          </div>
          <div class="timetable-row-buttons">
            <el-button size="large" :icon="Check" @click="updateAttendance(subject.period, true)" />
            <el-button size="large" :icon="Close" @click="updateAttendance(subject.period, false)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { watch, reactive, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import dateToString from '@/assets/js/dateToString';
import App from '@/App.vue';
import { Check, Close, Upload, ArrowDownBold } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import mixpanel from 'mixpanel-browser';
import L1_LANGUAGE_GROUPS from '@/assets/js/l1-language-teachers';

export default {
  name: 'TimetableView',

  setup() {
    const store = useStore();
    const router = useRouter();
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
            courseName: 'UE000 Subject',
            courseId: '',
            facultySubgroup: 0,
            languageSubgroup: 0
          },
          {
            period: 2,
            courseName: 'UE000 Subject',
            courseId: '',
            facultySubgroup: 0,
            languageSubgroup: 0
          },
          {
            period: 3,
            courseName: 'UE000 Subject',
            courseId: '',
            languageSubgroup: 0,
            facultySubgroup: 0
          },
          {
            period: 4,
            courseName: 'UE000 Subject',
            courseId: '',
            languageSubgroup: 0,
            facultySubgroup: 0
          }
        ]
      }
    });

    watch(appMounted, (appMounted) => {
      if (appMounted) {
        if (!store.getters['User/GET_IS_SIGNED_IN']) {
          ElMessage.info({ message: 'You need to be signed in to access this page.', showClose: true });
          router.push('/');
        } else {
          loadTimetableData();
          store.dispatch('Timetable/DOWNLOAD_UNMARKED_DATES');
        }
      }
    });

    watch(timetableDate, (newDate) => {
      store.dispatch('Timetable/SET_DATE', newDate);
      state.isDateUpdated = true;
      loadTimetableData();
    });

    onMounted(() => {
      if (store.getters['Timetable/GET_TIMETABLE']?.lessons.length !== 0) {
        state.timetable = store.getters['Timetable/GET_TIMETABLE'];
        state.loadingData = false;
      }
    });

    async function loadTimetableData() {
      if (store.getters['Timetable/GET_TIMETABLE']?.lessons.length !== 0 && !state.isDateUpdated) return;

      state.loadingData = true;

      try {
        if (state.timetable.lessons.length === 0) {
          state.timetable = {
            lessons: [
              {
                period: 1,
                courseName: 'UE000 Subject',
                courseId: '',
                facultySubgroup: 0,
                languageSubgroup: 0
              }
            ]
          };
        }

        await getTimetable();
        await getAttendances();
        // await Promise.all([getTimetable(), getAttendances()]);

        state.timetable.lessons.sort((a, b) => a.period - b.period);

        store.dispatch('Timetable/SET_TIMETABLE', state.timetable);
        state.isDateUpdated = false;
      } catch {
        return ElMessage.error({ message: 'Some error has occured. Please try again later.', showClose: true });
      } finally {
        state.loadingData = false;
      }
    }

    async function getTimetable() {
      const date = dateToString(timetableDate.value);
      const token = localStorage.getItem(store.getters['User/GET_JWT_LKEY']);

      try {
        const response = await fetch(store.getters['GET_URL'] + `/attendances/timetable/${date}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          const lessons = await response.json();

          const languageSubgroup = store.getters['User/GET_LANGUAGE_SUBGROUP'];
          const facultySubgroup = store.getters['User/GET_FACULTY_SUBGROUP'];

          state.timetable.lessons = lessons.filter((subject) => {
            if (subject.languageSubgroup === 0 && subject.facultySubgroup === 0) return true;
            if (subject.languageSubgroup === languageSubgroup && subject.facultySubgroup === 0) return true;
            if (subject.languageSubgroup === 0 && subject.facultySubgroup === facultySubgroup) return true;
          });
          state.timetable.lessons = state.timetable.lessons.filter((subject) => {
            if (subject.teacher === '') {
              return true;
            } else {
              let myLanguageTeacher = L1_LANGUAGE_GROUPS.find((l1_group) => l1_group.group === languageSubgroup);
              return subject.teacher === myLanguageTeacher.teacher;
            }
          });
        } else if (response.status === 500) {
          return ElMessage.error({
            message: 'Sorry. We have got some server errors. Please try again later.',
            showClose: true,
            grouping: true
          });
        } else {
          return ElMessage.error({ message: 'Some error has occured. Please try again later.', showClose: true, grouping: true });
        }
      } catch {
        return ElMessage.error({ message: 'Some error has occured. Please try again later.', showClose: true, grouping: true });
      }
    }

    async function getAttendances() {
      try {
        const date = dateToString(timetableDate.value);
        const token = localStorage.getItem(store.getters['User/GET_JWT_LKEY']);

        const response = await fetch(store.getters['GET_URL'] + `/attendances/${date}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          const attendances = await response.json();

          for (let i = 0; i < state.timetable.lessons.length; i++) {
            let lessonPeriod = state.timetable.lessons[i].period;
            let attendance = attendances.find((subject) => Number(subject.period) === Number(lessonPeriod));

            if (attendance) {
              state.timetable.lessons[i].hasAttended = attendance.hasAttended;
            } else {
              state.timetable.lessons[i].hasAttended = null;
            }
          }
        } else if (response.status === 500) {
          return ElMessage.error({
            message: 'Sorry. We have got some server errors. Please try again later.',
            showClose: true,
            grouping: true
          });
        } else {
          return ElMessage.error({ message: 'Some error has occured. Please try again later.', showClose: true, grouping: true });
        }
      } catch {
        return ElMessage.error({ message: 'Some error has occured. Please try again later.', showClose: true, grouping: true });
      }
    }

    async function updateAttendance(period, attended) {
      let lesson = state.timetable.lessons.find((subject) => subject.period == period);

      if (lesson.hasAttended === attended) return;

      const lastLessonAttended = lesson.hasAttended;
      lesson.hasAttended = attended;

      const token = localStorage.getItem(store.getters['User/GET_JWT_LKEY']);

      let isDateMarked = true;
      for (let subject of state.timetable.lessons) {
        if (!(subject.hasAttended === true || subject.hasAttended === false)) {
          isDateMarked = false;
          break;
        }
      }

      try {
        const response = await fetch(store.getters['GET_URL'] + '/attendances/record-attendance', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            period: Number(lesson.period),
            hasAttended: lesson.hasAttended,
            isDateMarked,
            attendanceDate: dateToString(timetableDate.value),
            courseId: lesson.courseId
          })
        });

        if (response.status === 200) {
          store.dispatch('Timetable/SET_TIMETABLE', state.timetable);
          store.dispatch('Statistics/CLEAR_STATISTICS');

          if (isDateMarked) {
            let markedDate = dateToString(timetableDate.value);
            store.dispatch('Timetable/REMOVE_MARKED_DATE', markedDate);
          }

          mixpanel.track('Record Attendance', {
            'Has Attended': lesson.hasAttended
          });
        } else if (response.status === 500) {
          lesson.hasAttended = lastLessonAttended;
          return ElMessage.error({
            message: 'Sorry. We have got some server errors. Please try again later.',
            showClose: true,
            grouping: true
          });
        } else {
          lesson.hasAttended = lastLessonAttended;
          return ElMessage.error({ message: 'Some error has occured. Please try again later.', showClose: true, grouping: true });
        }
      } catch {
        lesson.hasAttended = lastLessonAttended;
        return ElMessage.error({ message: 'Some error has occured. Please try again later.', showClose: true, grouping: true });
      }
    }

    function isDateDisabled() {
      // if (date > new Date() || date < new Date(2024, 8, 2, 0, 0, 0)) {
      //   return true;
      // } else {
      return false;
      // }
    }

    const isDateUnfilled = (date) => {
      const unmarkedDates = store.getters['Timetable/GET_UNMARKED_DATES'];
      date.setUTCHours(0);
      date.setDate(date.getDate() + 1);
      if (unmarkedDates.includes(date.toISOString().split('T')[0])) {
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
