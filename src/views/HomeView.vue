<template>
  <div class="home-page">
    <div class="header" v-if="!store.getters['User/GET_IS_SIGNED_IN']">
      <div class="header-logo">
        <img src="../assets/images/logo-round-background.png" alt="SkipSmart Logo" />
        <span>SkipSmart</span>
      </div>
      <div class="header-button">
        <RouterLink to="/register"><el-button>Sign Up</el-button></RouterLink>
      </div>
    </div>
    <div class="header" style="position: absolute" v-if="store.getters['User/GET_IS_SIGNED_IN']">
      <div class="header-logo">
        <img src="../assets/images/logo-round-background.png" alt="SkipSmart Logo" />
        <span>SkipSmart</span>
      </div>
    </div>

    <div class="block-1">
      <div class="container">
        <h2>TRACK YOUR ATTENDANCE</h2>
        <h1>Manage Your Attendance Effortlessly</h1>
        <p>
          Effortlessly monitor your class attendance and stay on track. SkipSmart helps UFAZ students keep tabs on their
          attendance, ensuring you stay organized.
        </p>

        <RouterLink to="/register" v-if="!store.getters['User/GET_IS_SIGNED_IN']">
          <button class="scale-button">Get Started</button>
        </RouterLink>
        <RouterLink to="/timetable" v-if="store.getters['User/GET_IS_SIGNED_IN']">
          <button class="scale-button">Get Started</button>
        </RouterLink>

        <div class="video-container">
          <video autoplay loop muted playsinline>
            <source src="../assets/videos/home-page-animation.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>

    <div class="block-2">
      <div class="container">
        <h2>USEFUL FEATURES FOR YOU</h2>
        <h1>SkipSmart is the perfect tool for your needs</h1>

        <div class="features">
          <div class="feature">
            <img src="../assets/images/attendance-tracking-feature.png" alt="Feature 1" />
            <h3>Effortless Attendance Tracking</h3>
            <p>Monitor your class attendance and missed sessions in real time, ensuring you never fall behind on your studies.</p>
          </div>
          <div class="feature">
            <img src="../assets/images/insights-feature.png" alt="Feature 2" />
            <h3>Comprehensive Attendance Insights</h3>
            <p>
              Access detailed reports on your attendance history and skipped classes to make informed decisions about your
              academic performance.
            </p>
          </div>
          <div class="feature">
            <img src="../assets/images/interface-feature.png" alt="Feature 3" />
            <h3>User-Friendly Interface</h3>
            <p>
              Enjoy an intuitive and easy-to-navigate design tailored for UFAZ students, making attendance management simple and
              efficient.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="block-3">
      <div class="container">
        <img src="../assets/images/home-page-person-image.jpg" alt="Person Image" />

        <h2>NO MORE UNRELIABLE MEMORY</h2>
        <h1>Mark your presence with <i>a single click</i>.</h1>
        <p>
          Attendance tracking has never been easier. With SkipSmart, you can effortlessly monitor your class attendance and missed
          sessions in real time, ensuring you never fall behind on your studies.
        </p>
        <br />
        <p>
          Access detailed reports on your attendance history and skipped classes to make informed decisions next time when you
          want to skip a lesson.
        </p>

        <RouterLink to="/register" v-if="!store.getters['User/GET_IS_SIGNED_IN']">
          <button class="scale-button">Try SkipSmart</button>
        </RouterLink>
        <RouterLink to="/timetable" v-if="store.getters['User/GET_IS_SIGNED_IN']">
          <button class="scale-button">Try SkipSmart</button>
        </RouterLink>
      </div>
    </div>

    <div class="block-4">
      <div class="container">
        <img src="../assets/images/record-attendance-image.svg" alt="Record Attendance Image" />

        <h1>How to record attendance with SkipSmart</h1>

        <h3>4 simple steps</h3>

        <p>
          <img src="../assets/images/sign-up-step.png" alt="Sign Up Step Image" />
          <span>Sign up to SkipSmart.</span>
        </p>

        <p>
          <img src="../assets/images/date-step.png" alt="Date Step Image" />
          <span>Select a date.</span>
        </p>

        <p>
          <img src="../assets/images/mark-step.png" alt="Mark Step Image" />
          <span>Mark your attendance with a single click. Сlick on either check or cross.</span>
        </p>

        <p>
          <img src="../assets/images/statistics-step.png" alt="Statistics Step Image" />
          <span>Review your attendance statistics. Go to the statistics page and view all the useful data.</span>
        </p>
      </div>
    </div>

    <div class="block-5">
      <div class="container">
        <h1>FAQ</h1>

        <el-collapse accordion>
          <el-collapse-item>
            <template #title>How to install the app on Android?</template>
            <div>Go to our website on Google Chrome and click on the three dots that you can see at the top right corner.</div>
            <br />
            <div>
              After that you will see the menu pop up. You will see there the option "Install The App" closer to the bottom. Click
              on it and the download process will start.
            </div>
          </el-collapse-item>
          <el-collapse-item>
            <template #title>How to install the app on IPhone?</template>
            <div>
              Go to our website. If you are using Google Chrome you will see the share button at the top right corner. And if you
              are using Safari browser, this button would be at the bottom middle.
            </div>
            <br />
            <div>After that a menu will pop up. Click on the "Add to Home Screen" and the download process will start.</div>
          </el-collapse-item>
          <el-collapse-item>
            <template #title>What if I accidentally mark my attendance incorrectly?</template>
            <div>
              You can edit your attendance records anytime you wish by navigating to the 'Timetable' section, specifying the date
              and making the necessary changes.
            </div>
          </el-collapse-item>
          <el-collapse-item>
            <template #title>How do I contact support if I have an issue?</template>
            <div>You can contact the author by emailing i.mammadov@ufaz.az.</div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>

    <div class="footer">
      <div class="container">
        <div class="footer-logo">
          <img src="../assets/images/logo-round-background.png" alt="SkipSmart Logo" />
          <span>SkipSmart</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';

export default {
  name: 'HomeView',

  setup() {
    const store = useStore();

    return { store };
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/home.scss';
@import '@/assets/styles/buttons.scss';
</style>
