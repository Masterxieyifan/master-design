import MdCollapse from './src/collapse.vue';

MdCollapse.install = function(Vue) {
    Vue.component(MdCollapse.name, MdCollapse);
};

export default MdCollapse;