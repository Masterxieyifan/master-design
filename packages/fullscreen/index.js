import MdFullscreen from './src/fullscreen.vue';

MdFullscreen.install = function(Vue) {
    Vue.component(MdFullscreen.name, MdFullscreen);
};

export default MdFullscreen;