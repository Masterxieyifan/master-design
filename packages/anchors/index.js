import MdAnchors from './src/anchors.vue';

MdAnchors.install = function(Vue) {
    Vue.component(MdAnchors.name, MdAnchors);
};

export default MdAnchors;