import MdStorageHash from './src/storage-hash';

MdStorageHash.install = function(Vue) {
    Vue.component(MdStorageHash.name, MdStorageHash);
};

export default MdStorageHash;
