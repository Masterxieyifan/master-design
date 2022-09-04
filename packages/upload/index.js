import MdUpload from './src/upload';

MdUpload.install = function(Vue) {
    Vue.component(MdUpload.name, MdUpload);
};

export default MdUpload;
