/*
 * @Author: Shixin
 * @Date: 2021-12-16 12:05:33
 * @LastEditors: Shixin
 * @LastEditTime: 2021-12-16 12:05:42
 * @Description: loadingButton组件
 * @FilePath: /master-design/packages/loading-button/index.js
 * 🍻 Write code drunkenly.
 */
import MdLoadingButton from './src/main';

/* istanbul ignore next */
MdLoadingButton.install = function(Vue) {
    Vue.component(MdLoadingButton.name, MdLoadingButton);
};

export default MdLoadingButton;
