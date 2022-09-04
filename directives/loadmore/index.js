/*
 * @Author: lingyong.zeng
 * @Date: 2022-06-09 16:52:27
 * @LastEditors: lingyong.zeng
 * @LastEditTime: 2022-06-10 09:52:50
 * @Description:
 * @FilePath: /vantop-ui/directives/loadmore/index.js
 */

export default {
    name: 'loadmore',
    bind(el, binding) {
        el.$listernDom = el.querySelector(
            '.el-select-dropdown .el-select-dropdown__wrap'
        );
        el.handler = function() {
            const CONDITION = this.scrollHeight - Math.ceil(this.scrollTop) <= this.clientHeight;
            // this.scrollTop !== 0 当输入时，如果搜索结果很少，以至于没看到滚动条，那么此时的CONDITION计算结果是true，会执行bind.value()，此时不应该执行，否则搜索结果不匹配
            if (CONDITION && this.scrollTop !== 0) {
                binding.value();
            }
        };

        // this.scrollTop  这里可能因为浏览器缩放存在小数点的情况，导致了滚动到底部时
        // scrollHeight 减去滚动到底部时的scrollTop ，依然大于clientHeight 导致无法请求更多数据
        // 这里将scrollTop向上取整 保证滚到底部时，触发调用
        el.$listernDom.addEventListener('scroll', el.handler);
    },
    unbind(el) {
        el.$listernDom.removeEventListener('scroll', el.handler);
        el.$listernDom = null;
        el.handler = null;
    }
};