import MdTree from './src/tree';

MdTree.install = function(Vue) {
    Vue.component(MdTree.name, MdTree);
};

export default MdTree;
