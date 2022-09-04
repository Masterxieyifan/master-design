/*
 * @Author: lingyong.zeng
 * @Date: 2022-06-09 16:54:04
 * @LastEditors: lingyong.zeng
 * @LastEditTime: 2022-06-09 18:12:36
 * @Description:
 * @FilePath: /vantop-ui/directives/scroll/index.js
 */

export default {
    name: 'scroll',
    bind(el, binding) {
        // 获取滚动页面DOM
        el.$listernDom = el.querySelector(
            '.el-select-dropdown .el-select-dropdown__wrap'
        );
        let scrollPosition = 0;
        el.handler = function() {
            // 当前的滚动位置 减去  上一次的滚动位置
            // 如果为true则代表向上滚动，false代表向下滚动
            let flagToDirection = this.scrollTop - scrollPosition > 0;
            // 记录当前的滚动位置
            scrollPosition = this.scrollTop;
            const LIMIT_BOTTOM = this.scrollHeight / 4.2;
            // 记录滚动位置距离底部的位置
            let scrollBottom =
                this.scrollHeight - (this.scrollTop + this.clientHeight) <
                LIMIT_BOTTOM;
            // 如果向下滚动 并且距离底部只有100px
            if (flagToDirection && scrollBottom) {
                // 将滚动行为告诉组件
                binding.value(
                    flagToDirection,
                    el.$listernDom,
                    this.scrollHeight / 2
                );
            }
            // 如果是向上滚动  并且距离顶部只有100px
            if (!flagToDirection && this.scrollTop < LIMIT_BOTTOM) {
                binding.value(
                    flagToDirection,
                    el.$listernDom,
                    this.scrollHeight / 2
                );
            }
        };
        el.$listernDom .addEventListener('scroll', el.handler);
    },
    unbind(el) {
        el.$listernDom.removeEventListener('scroll', el.handler);
        el.$listernDom = null;
        el.handler = null;
    }
};