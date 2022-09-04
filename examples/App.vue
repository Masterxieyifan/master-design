<template>
  <div id="app" class="wrapper">
    <Sidebar></Sidebar>
    <div class="page-container page-component">
      <router-view/>
    </div>
  </div>
</template>
<script>
import Sidebar from './common/Sidebar';
export default {
    name: 'app',
    components: {
        Sidebar,
    },
};
</script>
<style lang="scss">
.wrapper {
  height: 100vh;
  width: 100vw;
  display: flex;
}
</style>
