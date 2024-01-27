<template>
  <h1 class="site-title">
    <img src="../assets/images/logo-transparent.png" /><span class="logo-text">SkipSmart</span> - Statistics
  </h1>

  <div class="container statistics">
    <el-select v-model="selectedSubject" placeholder="Select the subject" size="large">
      <el-option v-for="subject in state.subjects" :key="subject[0]" :label="subject[1]" :value="subject[0]" />
    </el-select>

    <div v-loading="state.loadingData">
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
</template>

<script>
import { watch, reactive, ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Chart from 'chart.js/auto';
import { InfoFilled } from '@element-plus/icons-vue';
import App from '@/App.vue';

export default {
  name: 'AttendanceStatusView',

  setup() {
    const store = useStore();
    const router = useRouter();
    const toast = useToast();
    const { appMounted } = App.setup();

    const selectedSubject = ref('');
    const state = reactive({
      subjects: [],
      statistics: {},
      statisticsTable: [],
      loadingData: false,
      attendedProgressBar: 0,
      skippedProgressBar: 0
    });

    watch(appMounted, async (appMounted) => {
      if (appMounted) {
        if (!store.getters['User/GET_IS_SIGNED_IN']) {
          toast.info('You need to be signed in to access this page.');
          router.push('/');
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
            toast.warning('Complete all unmarked dates up to now to proceed to statistics page.');
            router.push('/timetable');
          }

          downloadSubjects();
        }
      }
    });

    onMounted(() => {
      // Load subjects list from VueX if there is one
      if (store.getters['Statistics/GET_SUBJECTS_LIST'].length !== 0) {
        state.subjects = store.getters['Statistics/GET_SUBJECTS_LIST'];
        selectedSubject.value = store.getters['Statistics/GET_CURRENT_SUBJECT'];
      }

      // Load statistics and statistics table from VueX if there is one
      if (store.getters['Statistics/GET_STATISTICS_TABLE'].length !== 0) {
        state.statisticsTable = store.getters['Statistics/GET_STATISTICS_TABLE'];

        state.statistics = store.getters['Statistics/GET_STATISTICS'];

        state.attendedProgressBar = (
          ((state.statistics.attendedLessons + state.statistics.skippedLessons) / state.statistics.totalLessons) *
          100
        ).toFixed(1);
        state.skippedProgressBar = (
          (state.statistics.skippedLessons / (state.statistics.skippedLessons + state.statistics.remainingSkips)) *
          100
        ).toFixed(1);
      }
    });

    watch(selectedSubject, async (newSubject) => {
      if (newSubject) {
        if (newSubject == store.getters['Statistics/GET_CURRENT_SUBJECT']) {
          return insertDataToChart();
        }

        store.dispatch('Statistics/SET_CURRENT_SUBJECT', newSubject);
        await getAttendanceStatus();
        insertDataToChart();
      }
    });

    async function downloadSubjects() {
      if (store.getters['Statistics/GET_SUBJECTS_LIST'].length !== 0) return;

      const token = localStorage.getItem(store.getters['User/GET_JWT_KEY']);

      const response = await fetch(store.getters['GET_URL'] + '/attendance/subjects', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        const data = await response.json();
        state.subjects = data.subjects;
        store.dispatch('Statistics/SET_SUBJECTS_LIST', state.subjects);
        store.dispatch('Statistics/SET_CURRENT_SUBJECT', state.subjects[0][0]);
        selectedSubject.value = state.subjects[0][0];

        await getAttendanceStatus();
        insertDataToChart();
      } else {
        return toast.error('Some error has occured. Please try again later.');
      }
    }

    async function getAttendanceStatus() {
      state.loadingData = true;

      const token = localStorage.getItem(store.getters['User/GET_JWT_KEY']);

      const response = await fetch(store.getters['GET_URL'] + `/attendance/status/${selectedSubject.value}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        const data = await response.json();
        state.statistics = data.attendanceStatus;
        store.dispatch('Statistics/SET_STATISTICS', data.attendanceStatus);

        state.attendedProgressBar = (
          ((state.statistics.attendedLessons + state.statistics.skippedLessons) / state.statistics.totalLessons) *
          100
        ).toFixed(1);
        state.skippedProgressBar = (
          (state.statistics.skippedLessons / (state.statistics.skippedLessons + state.statistics.remainingSkips)) *
          100
        ).toFixed(1);

        let tableKeys = {
          attendedLessons: 'Attended Lessons',
          skippedLessons: 'Skipped Lessons',
          remainingLessons: 'Remaining Lessons',
          remainingSkips: 'Remaining Skips',
          totalLessons: 'Total Lessons Number'
        };

        state.statisticsTable = [];

        for (let type of Object.keys(state.statistics)) {
          if (type == 'course') continue;
          state.statisticsTable.push({ type: tableKeys[type], value: state.statistics[type] });
        }

        store.dispatch('Statistics/SET_STATISTICS_TABLE', state.statisticsTable);

        state.loadingData = false;
      } else {
        state.loadingData = false;
        return toast.error('Some error has occured. Please try again later.');
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
              data: [state.statistics.attendedLessons, state.statistics.skippedLessons],
              backgroundColor: ['#ffd803', '#00ebc7'],
              hoverOffset: 4,
              borderColor: '#121629'
            }
          ]
        },
        options: {
          plugins: {
            legend: {
              labels: {
                color: '#b8c1ec',
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
              data: [state.statistics.remainingLessons, state.statistics.remainingSkips],
              backgroundColor: ['#ff8906', '#3da9fc'],
              hoverOffset: 4,
              borderColor: '#121629'
            }
          ]
        },
        options: {
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#b8c1ec',
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
