import MdTour from './src/tour';

MdTour.install = function(Vue) {
    Vue.component(MdTour.name, MdTour);
};

export default MdTour;
