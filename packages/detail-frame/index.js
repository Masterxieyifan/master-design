/*
 * @Author: lingyong.zeng
 * @Date: 2021-10-28 17:14:37
 * @LastEditors: lingyong.zeng
 * @LastEditTime: 2021-10-28 17:15:59
 * @Description:
 * @FilePath: /vantop-ui/packages/detail-frame/index.js
 */
import MdDetailFrame from './src/detailFrame.vue';

MdDetailFrame.install = function(Vue) {
    Vue.component(MdDetailFrame.name, MdDetailFrame);
};

export default MdDetailFrame;