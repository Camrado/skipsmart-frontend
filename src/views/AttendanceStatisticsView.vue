<template>
  <div class="statistics-page">
    <div class="header">
      <div class="header-logo">
        <img src="../assets/images/logo-round-background.png" alt="SkipSmart Logo" />
        <span>SkipSmart</span>
      </div>
      <div class="header-button"></div>
    </div>

    <div class="container statistics" v-loading="state.loadingData">
      <el-select v-model="selectedSubject" placeholder="Select the subject" size="large">
        <el-option v-for="subject in state.subjects" :key="subject.id" :label="subject.courseName" :value="subject.id" />
      </el-select>

      <div>
        <div class="statistics-pie-charts">
          <canvas id="pieChart1"></canvas>
          <canvas id="pieChart2"></canvas>
        </div>

        <div class="statistics-progress-bars">
          <div class="statistics-progress-bars-one">
            <el-progress :text-inside="true" :stroke-width="28" :percentage="+state.attendedProgressBar" />
            <el-popover
              placement="bottom-start"
              title="Completed Lessons"
              :width="200"
              trigger="hover"
              content="It displays the proportion of completed lessons, considering both attended and skipped, in relation to the total number of lessons."
            >
              <template #reference>
                <el-button circle :icon="InfoFilled" type="primary"></el-button>
              </template>
            </el-popover>
          </div>

          <div class="statistics-progress-bars-two">
            <el-progress :text-inside="true" :stroke-width="28" :percentage="+state.skippedProgressBar" />
            <el-popover
              placement="bottom-start"
              title="Used Skips"
              :width="200"
              trigger="hover"
              content="It shows the percentage of lessons that have been skipped in comparison to the total number of lessons that are skippable."
            >
              <template #reference>
                <el-button circle :icon="InfoFilled" type="primary"></el-button>
              </template>
            </el-popover>
          </div>
        </div>

        <div class="statistics-table">
          <el-table :data="state.statisticsTable">
            <el-table-column prop="type" />
            <el-table-column prop="value" width="70" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { watch, reactive, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Chart from 'chart.js/auto';
import { InfoFilled } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import App from '@/App.vue';
import mixpanel from 'mixpanel-browser';

export default {
  name: 'AttendanceStatusView',

  setup() {
    const store = useStore();
    const router = useRouter();
    const { appMounted } = App.setup();

    const selectedSubject = ref('');
    const state = reactive({
      subjects: [],
      statistics: {},
      statisticsTable: [],
      loadingData: true,
      attendedProgressBar: 0,
      skippedProgressBar: 0
    });

    watch(appMounted, async (appMounted) => {
      if (appMounted) {
        if (!store.getters['User/GET_IS_SIGNED_IN']) {
          ElMessage.info({ message: 'You need to be signed in to access this page.', showClose: true });
          router.push('/');
          state.loadingData = false;
        } else {
          if (store.getters['Timetable/GET_ARE_UNMARKED_DATES_LOADED'] === false) {
            state.loadingData = true;

            try {
              await store.dispatch('Timetable/DOWNLOAD_UNMARKED_DATES');
            } catch {
              state.loadingData = false;
            }
          }

          if (store.getters['Timetable/GET_UNMARKED_DATES'].length !== 0) {
            ElMessageBox.alert(
              `<p style="margin-bottom: 10px">You need to mark all the dates before accessing the statistics page.
                All unmarked dates are highlighted with <span style="color: red; font-style: italic;">red color</span> in calendar.</p>
                <p><b>Unmarked dates:</b> ${store.getters['Timetable/GET_UNMARKED_DATES'].join(', ')}</p>`,
              'How to access statistics?',
              {
                confirmButtonText: 'OK',
                dangerouslyUseHTMLString: true
              }
            );

            router.push('/timetable');
            state.loadingData = false;
          } else {
            await downloadSubjects();
          }
        }
      }
    });

    onMounted(async () => {
      // Load subjects list from VueX if there is one
      if (store.getters['Statistics/GET_SUBJECTS_LIST'].length !== 0) {
        state.subjects = store.getters['Statistics/GET_SUBJECTS_LIST'];
        selectedSubject.value = store.getters['Statistics/GET_CURRENT_SUBJECT'];
      }

      // Load statistics and statistics table from VueX if there is one
      if (store.getters['Statistics/GET_STATISTICS_TABLE'].length !== 0) {
        state.loadingData = false;

        state.statisticsTable = store.getters['Statistics/GET_STATISTICS_TABLE'];

        state.statistics = store.getters['Statistics/GET_STATISTICS'];

        state.attendedProgressBar = (
          ((state.statistics.attendedLessonsNumber + state.statistics.skippedLessonsNumber) /
            state.statistics.totalLessonsNumber) *
          100
        ).toFixed(1);
        state.skippedProgressBar = (
          (state.statistics.skippedLessonsNumber /
            (state.statistics.skippedLessonsNumber + state.statistics.remainingSkipsNumber)) *
          100
        ).toFixed(1);
      } else {
        if (store.getters['Statistics/GET_SUBJECTS_LIST'].length === 0) {
          await downloadSubjects();
        }
        await getAttendanceStatistics();
        insertDataToChart();
      }
    });

    watch(selectedSubject, async (newSubject) => {
      if (newSubject) {
        if (newSubject == store.getters['Statistics/GET_CURRENT_SUBJECT']) {
          insertDataToChart();
          return;
        }

        store.dispatch('Statistics/SET_CURRENT_SUBJECT', newSubject);
        await getAttendanceStatistics();
        insertDataToChart();
      }
    });

    async function downloadSubjects() {
      if (store.getters['Statistics/GET_SUBJECTS_LIST'].length !== 0) return;

      const token = localStorage.getItem(store.getters['User/GET_JWT_LKEY']);

      try {
        const response = await fetch(store.getters['GET_URL'] + '/courses/all', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          const data = await response.json();
          state.subjects = data;
          store.dispatch('Statistics/SET_SUBJECTS_LIST', state.subjects);
          store.dispatch('Statistics/SET_CURRENT_SUBJECT', state.subjects[0].id);
          selectedSubject.value = state.subjects[0].id;

          await getAttendanceStatistics();
          insertDataToChart();
        } else {
          return ElMessage.error({ message: 'Some error has occured. Please try again later.', grouping: true, showClose: true });
        }
      } catch {
        return ElMessage.error({ message: 'Some error has occured. Please try again later.', grouping: true, showClose: true });
      }
    }

    async function getAttendanceStatistics() {
      state.loadingData = true;

      const token = localStorage.getItem(store.getters['User/GET_JWT_LKEY']);

      try {
        const response = await fetch(store.getters['GET_URL'] + `/attendances/statistics?courseId=${selectedSubject.value}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          const data = await response.json();
          state.statistics = data;
          store.dispatch('Statistics/SET_STATISTICS', data);

          mixpanel.track('Look at Statistics', {
            'Course Id': selectedSubject.value,
            "User's Group Id": store.getters['User/GET_GROUP_ID']
          });

          state.attendedProgressBar = (
            ((state.statistics.attendedLessonsNumber + state.statistics.skippedLessonsNumber) /
              state.statistics.totalLessonsNumber) *
            100
          ).toFixed(1);
          state.skippedProgressBar = (
            (state.statistics.skippedLessonsNumber /
              (state.statistics.skippedLessonsNumber + state.statistics.remainingSkipsNumber)) *
            100
          ).toFixed(1);

          let tableKeys = {
            attendedLessonsNumber: 'Attended Lessons',
            skippedLessonsNumber: 'Skipped Lessons',
            remainingLessonsNumber: 'Remaining Lessons',
            remainingSkipsNumber: 'Remaining Skips',
            totalLessonsNumber: 'Total Lessons Number'
          };

          state.statisticsTable = [];

          for (let type of Object.keys(state.statistics)) {
            if (type == 'courseId') continue;
            state.statisticsTable.push({ type: tableKeys[type], value: state.statistics[type] });
          }

          store.dispatch('Statistics/SET_STATISTICS_TABLE', state.statisticsTable);

          state.loadingData = false;
        } else {
          state.loadingData = false;
          return ElMessage.error({ message: 'Some error has occured. Please try again later.', grouping: true, showClose: true });
        }
      } catch {
        state.loadingData = false;
        return ElMessage.error({ message: 'Some error has occured. Please try again later.', grouping: true, showClose: true });
      }
    }

    function insertDataToChart() {
      let pieChart1Status = Chart.getChart('pieChart1');
      let pieChart2Status = Chart.getChart('pieChart2');

      if (pieChart1Status != undefined) pieChart1Status.destroy();
      if (pieChart2Status != undefined) pieChart2Status.destroy();

      const ctx1 = document.getElementById('pieChart1');
      const ctx2 = document.getElementById('pieChart2');

      if (!ctx1 || !ctx2) return;

      const pieChart1 = new Chart(ctx1, {
        type: 'doughnut',
        data: {
          labels: ['Attended Lessons', 'Skipped Lessons'],
          datasets: [
            {
              label: 'Number',
              data: [state.statistics.attendedLessonsNumber, state.statistics.skippedLessonsNumber],
              backgroundColor: ['#1857a5', '#6daad9'],
              hoverOffset: 4,
              borderColor: '#021627'
            }
          ]
        },
        options: {
          plugins: {
            legend: {
              labels: {
                color: '#021627',
                font: {
                  size: 14
                }
              }
            }
          }
        }
      });

      const pieChart2 = new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: ['Remaining Lessons', 'Remaining Skips'],
          datasets: [
            {
              label: 'Number',
              data: [state.statistics.remainingLessonsNumber, state.statistics.remainingSkipsNumber],
              backgroundColor: ['#e23c55', '#ec93a0'],
              hoverOffset: 4,
              borderColor: '#021627'
            }
          ]
        },
        options: {
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#021627',
                font: {
                  size: 14
                }
              }
            }
          }
        }
      });

      pieChart1;
      pieChart2;
    }

    return { state, selectedSubject, InfoFilled };
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/statistics.scss';
</style>
