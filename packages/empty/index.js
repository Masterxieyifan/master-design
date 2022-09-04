/*
 * @Author: 陈建中
 * @Date: 2021-07-15 14:33:45
 * @LastEditTime: 2021-08-26 14:28:32
 * @LastEditors: 蔡远程
 * @Description: 空状态组件
 */
import MdEmpty from './src/empty';

MdEmpty.install = function(Vue) {
    Vue.component(MdEmpty.name, MdEmpty);
};

export default MdEmpty;
