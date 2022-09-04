import Vue from 'vue';
import HintSingletonTpl from './HintSingletonTpl.vue';
import { debounce } from '@master_vantop/vantop-util';
import __SINGLETON__ from '@/util/singleton.js';

// 以下两个变量会集成进 window.__SINGLETON__ 全局变量
// v-hint 使用计数，如果页面无 v-hint 使用，则要移除单例监听事件
const COUNT_KEY = '__MD_DIRECTIVE_HINT_COUNT__';
// v-hint 单例使用判断开关
const HINT_KEY = '__MD_DIRECTIVE_HINT__';
// 触发当前提示的元素
const REFERENCE_KEY = '__MD_DIRECTIVE_HINT_REFERENCE__';

const ELEMENT_CLASS = 'master-design-hint-directive';

function HintSingleton(propsData) {
    const Hint = Vue.extend(HintSingletonTpl);
    const hint = new Hint({
        propsData
    });
    hint.$mount();
    return hint;
}

const debounceShowHint = debounce(function(e) {
    const reference = e.target.closest(`.${ELEMENT_CLASS}`);
    if (!reference) {
        return;
    }
    const el = __SINGLETON__[HINT_KEY];

    // 增加判断，防止出现边界闪烁
    if (reference === __SINGLETON__[REFERENCE_KEY] && el.showProp) {
        return;
    }

    const { content, placement, popperClass } = reference.dataset;
    content && (el.content = content);
    placement && (el.placement = placement);
    popperClass && (el.popperClass = popperClass);

    el.showProp = false;
    el.reference = reference;
    __SINGLETON__[REFERENCE_KEY] = reference;

    // 因无 this 故使用 Promise 模拟 $nextTick
    Promise.resolve().then(() => {
        el.showProp = true;
        Promise.resolve().then(() => {
            el.$refs.pop.$refs.popper.classList.remove('el-popover', 'el-popper', 'el-popover--plain');
            el.$refs.pop.doShow();
        });
    });
}, 200);


export default {
    name: 'hint',
    bind(el, { value }) {
        const valueType = typeof value;
        let attrs = {
            content: '',
            placement: 'top',
            effect: 'dark'
        };

        if (valueType === 'string' || valueType === 'number') {
            attrs.content = value;
        } else {
            Object.assign(attrs, value);
        }

        el.dataset.content = attrs.content;
        el.dataset.popperClass = `el-tooltip__popper is-${attrs.effect} hint_directive_popper`;
        el.dataset.placement = attrs.placement;
        el.classList.add(ELEMENT_CLASS);

        attrs = null;

        __SINGLETON__[COUNT_KEY] = (__SINGLETON__[COUNT_KEY] || 0) + 1;
        if (!__SINGLETON__[HINT_KEY]) {  // 单例监听事件绑定
            document.body.addEventListener('mouseover', debounceShowHint);
            __SINGLETON__[HINT_KEY] = new HintSingleton({
                showProp: false,
                reference: {},
            });
        }
    },
    unbind() {
        --__SINGLETON__[COUNT_KEY];
        if (!__SINGLETON__[COUNT_KEY]) {   // 页面不存在 v-hint 时则移除单例监听事件
            __SINGLETON__[HINT_KEY].$destroy();
            __SINGLETON__[HINT_KEY] = null;
            __SINGLETON__[REFERENCE_KEY] = null;
            document.body.removeEventListener('mouseover', debounceShowHint);
        }
    }
};