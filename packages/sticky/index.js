import MdSticky from './src/sticky';

MdSticky.install = function(Vue) {
    Vue.component(MdSticky.name, MdSticky);
};

export const Sticky = MdSticky;
export default MdSticky;
