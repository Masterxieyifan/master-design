import MdSidebar from './src/sidebar.vue';

MdSidebar.install = function(Vue) {
    Vue.component(MdSidebar.name, MdSidebar);
};

export default MdSidebar;