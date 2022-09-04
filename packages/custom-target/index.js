import MdCustomTarget from './src/custom-target';

MdCustomTarget.install = function(Vue) {
    Vue.component(MdCustomTarget.name, MdCustomTarget);
};

export default MdCustomTarget;
