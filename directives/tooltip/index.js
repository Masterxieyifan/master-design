/*
 * @Author: lingyong.zeng
 * @Date: 2022-06-10 09:19:14
 * @LastEditors: lingyong.zeng
 * @LastEditTime: 2022-06-10 09:21:46
 * @Description:
 * @FilePath: /vantop-ui/directives/tooltip/index.js
 */

import Vue from 'vue';
import Tooltip from './tooltip.vue';

const tooltipTpl = Vue.extend(Tooltip);

export default {
    name: 'tooltip',
    bind(el, binding, vnode) {
        let { value = {}, modifiers, } = binding;
        // string || number 直接赋值 content
        if (typeof (value) === 'string' || typeof (value) === 'number') {
            const text = value;
            value = {};
            value.content = text;
        }

        // 默认值
        let {
            content = '',
            effect = 'dark',
            'popper-class': className = '',
            placement = 'top',
            ...rest  // 其他属性 同 el-tooltip || el-popover
        } = value;

        // 继承class
        const spanClass = vnode.elm.className;
        // 修饰符
        if (modifiers.top) {
            placement = 'top';
        } else if (modifiers.bottom) {
            placement = 'bottom';
        } else if (modifiers.left) {
            placement = 'left';
        } else if (modifiers.right) {
            placement = 'right';
        }

        // 创建el-popover DOM
        const newTpl = tooltipTpl;
        let newTplDom = new tooltipTpl({
            data() {
                return {
                    className,
                    spanClass,
                    effect,
                    placement,
                    content,
                    rest,
                };
            },
        }).$mount().$el;

        // 确保获取DOM节点
        setTimeout(DomOperation, 0);

        // 操作DOM;
        function DomOperation() {
            // 确保获取到DMO
            if (!newTplDom || !el.parentNode) {
                if (newTpl !== null) {
                    newTplDom = new newTpl().$mount().$el;
                }
                return setTimeout(DomOperation, 0);
            }
            // 插入元素
            el.parentNode.replaceChild(newTplDom, el);
            newTplDom.appendChild(el);
            newTplDom.appendChild(el);
        }
    },
    // 实现双向绑定
    componentUpdated(el, { value, }, vnode) {
        // 新旧值相同则return
        const directives = vnode.data.directives.find(item => item.name === 'tooltip');
        if (!directives || directives.value === directives.oldValue) return;
        // 待测试 __vue__ https://github.com/vuejs/vue/issues/5621
        const vueComponent = el.parentElement.__vue__;
        if (vueComponent && vueComponent.$root) {
            if (typeof (value) === 'string' || typeof (value) === 'number') {
                vueComponent.$root.content = value;
            } else {
                vueComponent.$root.content = value.content;
            }
        }
    },
};

