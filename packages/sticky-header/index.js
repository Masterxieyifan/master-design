import MdStickyHeader from './src/sticky-header.vue';

MdStickyHeader.install = function(Vue) {
    Vue.component(MdStickyHeader.name, MdStickyHeader);
};

export default MdStickyHeader;