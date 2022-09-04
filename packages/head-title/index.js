/*
 * @Author: lingyong.zeng
 * @Date: 2021-07-28 14:52:23
 * @LastEditors: 蔡远程
 * @LastEditTime: 2021-08-26 14:28:37
 * @Description:
 */
import MdHeadTitle from './src/head-title';

MdHeadTitle.install = function(Vue) {
    Vue.component(MdHeadTitle.name, MdHeadTitle);
};

export default MdHeadTitle;
