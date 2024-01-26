<template>
  <div class="navigation-container">
    <div class="navigation-background"></div>
    <div class="navigation">
      <ul>
        <li class="list" :class="{ active: state.isLinkActive.isHomeActive }">
          <RouterLink to="/">
            <span class="icon">
              <ion-icon name="home-outline"></ion-icon>
            </span>
            <span class="text">Home</span>
          </RouterLink>
        </li>
        <!-- <li class="list" :class="{ active: state.isLinkActive.isContactActive }">
          <RouterLink to="/contacts">
            <span class="icon">
              <ion-icon name="megaphone-outline"></ion-icon>
            </span>
            <span class="text">Contacts</span>
          </RouterLink>
        </li> -->
        <li class="list" :class="{ active: state.isLinkActive.isTimetableActive }">
          <RouterLink to="/timetable">
            <span class="icon">
              <!-- <ion-icon name="timer-outline"></ion-icon> -->
              <img src="../assets/images/logo-transparent-black.png" alt="" width="30" height="30" />
            </span>
            <span class="text">Timetable</span>
          </RouterLink>
        </li>
        <li class="list" :class="{ active: state.isLinkActive.isStatisticsActive }">
          <RouterLink to="/me/attendance-statistics">
            <span class="icon">
              <ion-icon name="stats-chart-outline"></ion-icon>
            </span>
            <span class="text">Statistics</span>
          </RouterLink>
        </li>
        <li class="list" :class="{ active: state.isLinkActive.isSettingsActive }">
          <RouterLink to="/me/settings">
            <span class="icon">
              <ion-icon name="settings-outline"></ion-icon>
            </span>
            <span class="text">Settings</span>
          </RouterLink>
        </li>
        <div class="indicator"></div>
      </ul>
    </div>
  </div>
</template>

<script>
import { reactive, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'BottomNavBar',

  setup() {
    const route = useRoute();
    const state = reactive({
      isLinkActive: {
        isHomeActive: false,
        // isContactActive: false,
        isTimetableActive: false,
        isStatisticsActive: false,
        isSettingsActive: false
      }
    });

    onMounted(() => {
      if (route.name == 'home') {
        state.isLinkActive.isHomeActive = true;
      } else if (route.name == 'timetable') {
        state.isLinkActive.isTimetableActive = true;
      } else if (route.name == 'attendance-statistics') {
        state.isLinkActive.isStatisticsActive = true;
      } else if (route.name == 'settings') {
        state.isLinkActive.isSettingsActive = true;
      }
    });

    watch(
      () => route.name,
      (newRouteName) => {
        state.isLinkActive = {
          isHomeActive: false,
          // isContactActive: false,
          isTimetableActive: false,
          isStatisticsActive: false,
          isSettingsActive: false
        };

        if (newRouteName == 'home') {
          state.isLinkActive.isHomeActive = true;
        } else if (newRouteName == 'timetable') {
          state.isLinkActive.isTimetableActive = true;
        } else if (newRouteName == 'attendance-statistics') {
          state.isLinkActive.isStatisticsActive = true;
        } else if (route.name == 'settings') {
          state.isLinkActive.isSettingsActive = true;
        }
      }
    );

    return { state };
  }
};
</script>

<style lang="scss">
:root {
  --clr: #232946;
}

.navigation-container {
  z-index: 6;
  position: fixed;
  bottom: -1px;
  height: 115px;

  .navigation-background {
    position: absolute;
    top: 0;
    width: 100vw;
    height: 45px;
    background-image: linear-gradient(#23294600, #232946);
  }

  .navigation {
    position: relative;
    margin-top: 45px;
    width: 100vw;
    height: 70px;
    background-color: #b8c1ec;
    display: flex;
    justify-content: center;
    align-items: center;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .navigation ul {
    display: flex;
    justify-content: space-between;
    width: 350px;
  }

  .navigation ul li {
    position: relative;
    list-style: none;
    width: 70px;
    height: 70px;
    z-index: 1;
  }

  .navigation ul li a {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    text-align: center;
    font-weight: 500;
  }

  .navigation ul li a .icon {
    position: relative;
    display: block;
    line-height: 75px;
    font-size: 1.5em;
    text-align: center;
    transition: 0.5s;
    color: var(--clr);
  }

  .navigation ul li.active a .icon {
    transform: translateY(-32px);
  }

  .navigation ul li a .text {
    position: absolute;
    color: var(--clr);
    font-weight: bold;
    font-size: 1em;
    letter-spacing: 0.05em;
    transition: 0.5s;
    transform: translateY(20px);
    opacity: 0;
  }

  .navigation ul li.active a .text {
    transform: translateY(10px);
    opacity: 1;
  }

  .indicator {
    position: absolute;
    top: -50%;
    width: 70px;
    height: 70px;
    background: #eebbc3;
    border-radius: 50%;
    border: 6px solid #232946;
    transition: 0.5s;
  }

  .indicator::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -22px;
    width: 20px;
    height: 20px;
    background: transparent;
    border-top-right-radius: 20px;
    box-shadow: 1px -10px 0 0 #232946;
  }

  .indicator::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -22px;
    width: 20px;
    height: 20px;
    background: transparent;
    border-top-left-radius: 20px;
    box-shadow: -1px -10px 0 0 #232946;
  }

  .navigation ul li:nth-child(1).active ~ .indicator {
    transform: translateX(calc(70px * 0));
  }
  .navigation ul li:nth-child(2).active ~ .indicator {
    transform: translateX(calc(70px * 1 + 23px));
  }
  .navigation ul li:nth-child(3).active ~ .indicator {
    transform: translateX(calc(70px * 2 + 47px));
  }
  .navigation ul li:nth-child(4).active ~ .indicator {
    transform: translateX(calc(70px * 4 - 0.5px));
  }
}
</style>
