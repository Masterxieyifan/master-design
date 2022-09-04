import MdTimeline from './src/timeline';

MdTimeline.install = function(Vue) {
    Vue.component(MdTimeline.name, MdTimeline);
};

export default MdTimeline;
