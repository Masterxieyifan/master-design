<template>
    <div :class="['vantop-collapse--wrapper', { padding: padding },{ border: border }]">
        <div :class="['title-wrapper', { show: padding || showContent }, { padding: !padding}]">
            <slot name="title">
                <div class="title" v-if="showTitle">
                    <span class="title-tag"></span>
                    <span>{{ title }}</span>
                </div>
            </slot>
            <div class="title-content">
                <slot name="content"></slot>
            </div>
            <slot name="button">
                <div class="toggle-button" v-if="showButton" @click="toggle">
                    <span v-if="showButtonText">{{ showContent ? hiddenText : showText }}</span>
                    <i :class="['iconfont', icon, { expansion: showContent }]" v-if="icon"></i>
                    <i :class="['icon el-icon-arrow-down',{ expansion: showContent }]" v-else></i>
                </div>
            </slot>
        </div>
        <transition
            v-on:before-enter="beforeEnter"
            v-on:enter="enter"
            v-on:after-enter="afterEnter"
            v-on:before-leave="beforeLeave"
            v-on:leave="leave"
            v-on:after-leave="afterLeave"
        >
            <div
                :class="['collapse-content', { 'pure-display': isPure }]"
                v-show="showContent"
            >
                <slot></slot>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    name: 'MdCollapse',
    props: {
        showButton: {
            type: Boolean,
            default: true,
        },
        defaultShow: {
            type: Boolean,
            default: true,
        },
        isPure: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: '详情'
        },
        showTitle: {
            type: Boolean,
            default: true,
        },
        padding: {
            type: Boolean,
            default: true,
        },
        border: {
            type: Boolean,
            default: true,
        },
        icon: {
            type: String,
            default: ''
        },
        showText: {
            type: String,
            default: '展开'
        },
        hiddenText: {
            type: String,
            default: '收起'
        },
        showButtonText: {
            type: Boolean,
            default: true,
        }
    },
    watch: {
        showContent(val) {
            this.$emit('change', val, this.title);
        }
    },
    data() {
        return {
            showContent: true,
        };
    },
    created() {
        this.showContent = this.defaultShow;
    },
    methods: {
        toggle() {
            this.showContent = !this.showContent;
        },
        open() {
            this.showContent = true;
        },
        close() {
            this.showContent = false;
        },
        addClass(el, cls) {
            if (!el) return;
            let curClass = el.className;
            let classes = (cls || '').split(' ');

            for (let i = 0, j = classes.length; i < j; i++) {
                let clsName = classes[i];
                if (!clsName) continue;

                if (el.classList) {
                    el.classList.add(clsName);
                } else if (!this.hasClass(el, clsName)) {
                    curClass += ' ' + clsName;
                }
            }
            if (!el.classList) {
                el.className = curClass;
            }
        },

        removeClass(el, cls) {
            if (!el || !cls) return;
            let classes = cls.split(' ');
            let curClass = ' ' + el.className + ' ';

            for (let i = 0, j = classes.length; i < j; i++) {
                let clsName = classes[i];
                if (!clsName) continue;

                if (el.classList) {
                    el.classList.remove(clsName);
                } else if (this.hasClass(el, clsName)) {
                    curClass = curClass.replace(' ' + clsName + ' ', ' ');
                }
            }
            if (!el.classList) {
                el.className = this.trim(curClass);
            }
        },
        trim(string) {
            return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
        },
        hasClass(el, cls) {
            if (!el || !cls) return false;
            if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
            if (el.classList) {
                return el.classList.contains(cls);
            }
            return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
        },
        beforeEnter(el) {
            this.addClass(el, 'vt-collapse-transition');
            if (!el.dataset) el.dataset = {};
            el.style.height = '0';
            el.style.paddingTop = 0;
        },
        enter(el) {
            el.dataset.oldOverflow = el.style.overflow;
            if (el.scrollHeight !== 0) {
                el.style.height = el.scrollHeight + 'px';
            } else {
                el.style.height = '';
            }
            el.style.overflow = 'hidden';
        },
        afterEnter(el) {
            this.removeClass(el, 'vt-collapse-transition');
            el.style.height = '';
            el.style.overflow = el.dataset.oldOverflow;
        },
        beforeLeave(el) {
            if (!el.dataset) el.dataset = {};
            el.dataset.oldOverflow = el.style.overflow;
            el.style.height = el.scrollHeight + 'px';
            el.style.overflow = 'hidden';
        },
        leave(el) {
            if (el.scrollHeight !== 0) {
                this.addClass(el, 'vt-collapse-transition');
                el.style.height = 0;
            }
        },
        afterLeave(el) {
            this.removeClass(el, 'vt-collapse-transition');
            el.style.height = '';
            el.style.overflow = el.dataset.oldOverflow;
        },
    }
};
</script>
