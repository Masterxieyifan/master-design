<template>
    <div class="menu-nav">
        <router-link @click.native="currentPath = path;" v-for="({path, name}) of menuList" :key="path" :to="path" :style="{'color': path === currentPath ? '#3377ff' : ''}">{{name}}</router-link>
    </div>
</template>
<script>
import config from '../config/index.js';
export default {
    name: 'NavBar',
    data() {
        return {
            menuList: config.menuList,
            currentPath: ''
        };
    },
    mounted() {
        this.currentPath = this.$route.path || '/vantop-table';
    },
};
</script>
<style lang="scss">
.menu-nav {
    display: flex;
    flex-direction: column;
    padding: 20px;
    min-width: 200px;
    overflow-y: auto;
    a{
        padding: 5px;
        word-break: keep-all;
        text-decoration: none;
        color: unset;
        font-size: 14px;
        &:hover {
            color: #3377FF;
        }
    }
}
</style>