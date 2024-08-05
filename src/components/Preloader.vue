<template>
  <div class="preloader">
    <img src="@/assets/images/loading.svg" alt="Loading GIF" />
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Preloader'
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.preloader {
  width: 100vw;
  height: 100vh;
  z-index: 10000000000000000;
  position: fixed;
  top: 0;
  left: 0;
  background: $preloader-color;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    margin-top: -10vh;
    width: 50vw;
  }
}
</style>
