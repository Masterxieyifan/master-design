import MdPreview from './src/preview.vue';

MdPreview.install = function(Vue) {
    Vue.component(MdPreview.name, MdPreview);
};

export default MdPreview;
