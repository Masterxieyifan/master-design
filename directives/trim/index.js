/*
 * @Author: lingyong.zeng
 * @Date: 2022-06-09 16:52:27
 * @LastEditors: lingyong.zeng
 * @LastEditTime: 2022-06-09 18:08:39
 * @Description:
 * @FilePath: /vantop-ui/directives/trim/index.js
 */

export default {
    name: 'trim',
    inserted(el, { modifiers }) {
        el.$listernDom = el.children[0];
        el.$event = Object.keys(modifiers)[0] || 'change';
        el.handler = function() {
            el.$listernDom.value = el.$listernDom.value.trim();
            // 触发 input 实现双向绑定
            el.$listernDom.dispatchEvent(new Event('input'));
        };

        el.$listernDom.addEventListener(el.$event, el.handler);
    },
    unbind(el) {
        el.$listernDom.removeEventListener(el.$event, el.handler);
        el.$listernDom = null;
        el.$event = null;
        el.handler = null;
    }
};