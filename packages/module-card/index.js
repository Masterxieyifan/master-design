/*
 * @Author: lingyong.zeng
 * @Date: 2021-10-28 17:14:37
 * @LastEditors: lingyong.zeng
 * @LastEditTime: 2021-10-28 17:15:59
 * @Description:
 * @FilePath: /vantop-ui/packages/detail-frame/index.js
 */
import MdModuleCard from './src/moduleCard.vue';

MdModuleCard.install = function(Vue) {
    Vue.component(MdModuleCard.name, MdModuleCard);
};

export default MdModuleCard;