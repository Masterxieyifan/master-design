<template>
    <div
        class="vantop-ellipsis--wrapper"
        :style="{ '--line-clamp': line }"
        :data-placement="placement"
        :data-content="content"
        :data-popper-class="popoverClass"
    >
        <slot></slot>
    </div>
</template>

<script>
import Vue from 'vue';
import PopoverSingletonTpl from './PopoverSingletonTpl.vue';
import { debounce } from '@master_vantop/vantop-util';
import __SINGLETON__ from '@/util/singleton.js';

// 以下两个变量会集成进 window.__SINGLETON__ 全局变量
// MdPopover 使用计数，如果页面无 MdPopover 使用，则要移除单例监听事件
const COUNT_KEY = '__MD_POPOVER_SINGLETON_COUNT__';
// MdPopover 单例使用判断开关
const POPPER_KEY = '__MD_POPOVER_SINGLETON__';

function PopoverSingleton(propsData) {
    const Popover = Vue.extend(PopoverSingletonTpl);
    const popover = new Popover({
        propsData
    });
    popover.$mount();
    return popover;
}

const debounceShowPopoper = debounce(function(e) {
    /*
     * 1. 判断是否时 md-popover reference 鼠标事件触发
     * 2. 判断是否有省略号、无省略号不需要弹窗
     */
    const reference = e.target.closest('.vantop-ellipsis--wrapper');

    if (
        !reference
        || !isEnablePopoper(reference)
    ) {
        return;
    }

    const el = __SINGLETON__[POPPER_KEY];
    const { content, placement, popperClass } = reference.dataset;
    content && (el.content = content);
    placement && (el.placement = placement);
    popperClass && (el.popperClass = popperClass);

    el.showProp = false;
    el.reference = reference;

    // 因无this故使用Promise模拟$nextTick
    Promise.resolve().then(() => {
        el.showProp = true;
        Promise.resolve().then(() => {
            el.$refs.pop.doShow();
        });
    });
}, 400);

// 判断是否需要显示弹窗（无省略号时不需要显示弹窗）
function isEnablePopoper(el) {
    const { scrollHeight, clientHeight } = el;
    const isOverflow = scrollHeight > clientHeight;
    return isOverflow;
}

export default {
    name: 'MdPopover',
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
        placement: {
            type: String,
            default: 'top',
            validator: val => typeof val === 'string',
        },
        popperClass: {
            type: String,
            default: '',
            validator: val => typeof val === 'string',
        },
        line: {
            type: Number,
            default: 1,
            validator: val => typeof val === 'number',
        },
        content: {
            typel: String,
            default: ''
        }
    },
    data() {
        return {
            el: null,
            reference: {},
            showProp: false,
            debounceShowPopoper: null,
        };
    },
    computed: {
        popoverClass() {
            return `vantop-popover--wrapper vantop-popver--conetent ${this.popperClass}`;
        }
    },
    mounted() {
        __SINGLETON__[COUNT_KEY] = (__SINGLETON__[COUNT_KEY] || 0) + 1;
        if (!__SINGLETON__[POPPER_KEY]) {  // 单例监听事件绑定
            document.body.addEventListener('mouseover', debounceShowPopoper);
            __SINGLETON__[POPPER_KEY] = new PopoverSingleton({
                showProp: false,
                reference: {},
            });
        }
    },
    beforeDestroy() {
        --__SINGLETON__[COUNT_KEY];
        if (!__SINGLETON__[COUNT_KEY]) {   // 页面不存在 MdPopover 时则移除单例监听事件
            __SINGLETON__[POPPER_KEY].$destroy();
            __SINGLETON__[POPPER_KEY] = null;
            document.body.removeEventListener('mouseover', debounceShowPopoper);
        }
    },
};
</script>