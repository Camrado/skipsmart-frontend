<template>
  <div class="home-page">
    <div class="block-1">
      <div class="background"></div>
      <img src="../assets/images/home-page-image.svg" alt="Home Page Image" />
      <div class="block-1-text">
        <h2>Record The Attendance</h2>
        <p>With SkipSmart no more attendance haze, clarity's in sight. Get real-time data, make studying a delight.</p>

        <RouterLink to="/login" v-if="!store.getters['User/GET_IS_SIGNED_IN']">
          <el-button>
            Sign In<el-icon class="el-icon--right"><img src="../assets/images/arrow-right.png" /></el-icon>
          </el-button>
        </RouterLink>
        <RouterLink to="/timetable" v-if="store.getters['User/GET_IS_SIGNED_IN']">
          <el-button>
            Timetable<el-icon class="el-icon--right"><img src="../assets/images/arrow-right.png" /></el-icon>
          </el-button>
        </RouterLink>
      </div>
    </div>
    <div class="block-1-1">
      <div class="container">
        <h2>How To Install The App?</h2>
        <p>You can seamlessly download our app onto your mobile device using both Google Chrome and Safari.</p>
        <br />
        <p>Simply go to our website and follow the instructions tailored to your specific device:</p>
        <br />
        <h3>On IPhone:</h3>
        <p>
          Go to our website. If you are using Google Chrome you will see the share button at the top right corner. And if you are
          using Safari browser, this button would be at the bottom middle.
        </p>
        <br />
        <img src="../assets/images/iphone-chrome-step-1.png" alt="IPhone Chrome Step 1" />
        <br /><br />
        <img src="../assets/images/iphone-safari-step-1.png" alt="IPhone Safari Step 1" />
        <br /><br />
        <p>After that a menu will pop up. Click on the "Add to Home Screen" and the download process will start</p>
        <br />
        <img src="../assets/images/iphone-step-2.jpg" alt="IPhone Step 2" />
        <br /><br />
        <h3>On Android:</h3>
        <p>Go to our website on Google Chrome and click on the three dots that you can see at the top right corner.</p>
        <br />
        <img src="../assets/images/android-step-1.jpg" alt="Android Step 1" />
        <br /><br />
        <p>
          After that you will see the menu pop up. You will see there the option "Install The App". Click on it and the download
          process will start.
        </p>
        <br />
        <img src="../assets/images/android-step-2.jpg" alt="Android Step 2" />
        <br /><br />
      </div>
    </div>
    <div class="block-2">
      <div class="white-background">
        <div class="container">
          <h2>Attendance made easy with SkipSmart. No more unreliable memory. Mark your presence with a single click.</h2>
          <p>
            By default, you'll see your schedule for the day. But what if you forgot to mark yesterday's attendance? No worries!
            Just click the date at the top of the page and choose any day you need.
          </p>
          <br />
          <img src="../assets/images/home-page-timetable-1.png" alt="Photo 1" />
          <br /><br />
          <p>
            <i>Marking attendance is <b>simple ⭐</b>:</i>
          </p>
          <br />
          <ul>
            <li>
              Present for the lesson? Click the green checkmark ✅! Your attended classes will be highlighted in green, reminding
              you of your academic victories.
            </li>
            <br />
            <li>
              Skipped a class? No shame! Click the red cross ❌. Skipped classes will be outlined in red, giving you a clear
              picture of areas to focus on.
            </li>
          </ul>
          <br />
          <img src="../assets/images/home-page-timetable-2.png" alt="Photo 2" />
          <br /><br />
          <p>
            Once you've marked your attendance for the day, click the update button. Your records will be saved, keeping you
            organized and in control.
          </p>
          <br />
          <img src="../assets/images/home-page-timetable-3.png" alt="Photo 3" />
          <br />
        </div>
      </div>
    </div>
    <div class="block-3">
      <div class="container">
        <h2>Dive Deeper with Insights: Your Personal Stats Playground</h2>
        <p>
          Choose your subject of study: Want to dissect your Math mastery or decipher your Physics dynamics? Simply select the
          subject and watch your stats unfold.
        </p>
        <br />
        <p>
          <i>Visualize your <b>wins ✨:</b></i>
        </p>
        <br />
        <div class="pie-chart-section">
          <p>
            <b>Pie Chart Power:</b> Witness the glorious balance (or imbalance) between attended and skipped lessons. See your
            progress at a glance.
          </p>
          <canvas id="homePieChart"></canvas>
        </div>
        <br /><br />
        <div class="progress-bar-section">
          <el-progress type="circle" :percentage="25" />
          <p>
            After observing the pie charts, you'll find two <b>progress bars</b>. And one of them will display the number of
            lessons yet to be completed.
          </p>
        </div>
        <br /><br />
        <p>
          <b><i>Deeper Than Digits:</i></b>
        </p>
        <br />
        <p>
          Delve into the details with a comprehensive table. See attendance percentages, dates, and notes, giving you a granular
          understanding of your academic journey.
        </p>
        <br />
        <el-table :data="state.table">
          <el-table-column prop="type" />
          <el-table-column prop="value" width="70" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { ArrowRightBold } from '@element-plus/icons-vue';
import Chart from 'chart.js/auto';
import { onMounted, reactive } from 'vue';

export default {
  name: 'HomeView',

  setup() {
    const store = useStore();
    const state = reactive({
      table: [
        { type: 'Attended Lessons', value: 5 },
        { type: 'Skipped Lessons', value: 1 },
        { type: 'Remaining Lessons', value: 20 },
        { type: 'Remaining Skips', value: 5 },
        { type: 'Total Lessons Number', value: 26 }
      ]
    });

    onMounted(() => {
      insertDataToChart();
    });

    function insertDataToChart() {
      let pieChart1Status = Chart.getChart('homePieChart');

      if (pieChart1Status != undefined) pieChart1Status.destroy();

      const ctx1 = document.getElementById('homePieChart');

      if (!ctx1) return;

      const pieChart = new Chart(ctx1, {
        type: 'doughnut',
        data: {
          labels: ['Attended Lessons', 'Skipped Lessons'],
          datasets: [
            {
              label: 'Number',
              data: [10, 2],
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

      pieChart;
    }

    return { store, ArrowRightBold, state };
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/home.scss';
</style>
