<template>
  <div class="preloader">
    <img src="@/assets/images/loading.gif" alt="Loading GIF" />
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Preloader'
};
</script>

<style lang="scss" scoped>
.preloader {
  width: 100vw;
  height: 100vh;
  z-index: 1000000;
  position: fixed;
  top: 0;
  left: 0;
  background: #232946;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 30vw;
  }
}
</style>
