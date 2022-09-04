import MdRender from './src/render.js';

MdRender.install = function(Vue) {
    Vue.component(MdRender.name, MdRender);
};

export default MdRender;
