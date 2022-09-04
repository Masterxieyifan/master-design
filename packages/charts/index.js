import MdCharts from './src/charts';

MdCharts.install = function(Vue) {
    Vue.component(MdCharts.name, MdCharts);
};

export default MdCharts;
