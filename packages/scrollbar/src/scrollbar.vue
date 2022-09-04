<!--
 * @Descripttion: 滚动条组件
 * @Author: 蔡远程
 * @Date: 2021-12-23 15:21:33
 * @LastEditTime: 2021-12-26 10:03:52
 * @LastEditors: 蔡远程
-->
<template>
    <div ref="scrollbar$" class="md-scrollbar">
        <div
            ref="wrap$"
            :class="[
                wrapClass,
                'md-scrollbar__wrap',
                native ? '' : 'md-scrollbar__wrap--hidden-default',
            ]"
            :style="style"
            @scroll="handleScroll"
        >
            <component
                :is="tag"
                ref="resize$"
                :class="['md-scrollbar__view', viewClass]"
                :style="viewStyle"
            >
                <slot />
            </component>
        </div>
        <template v-if="!native">
            <bar
                :move="moveX"
                :ratio="ratioX"
                :size="sizeWidth"
                :always="always"
            />
            <bar
                :move="moveY"
                :ratio="ratioY"
                :size="sizeHeight"
                vertical
                :always="always"
            />
        </template>
    </div>
</template>

<script>
import Bar from './bar';
import { addUnit } from '@/util';
import { isNumber } from '@master_vantop/vantop-util';
export default {
    name: 'MdScrollbar',
    components: {
        Bar,
    },
    provide() {
        return {
            scrollbar: this,
        };
    },
    props: {
        height: {
            type: [String, Number],
            default: '',
        },
        maxHeight: {
            type: [String, Number],
            default: '',
        },
        native: {
            type: Boolean,
            default: false,
        },
        wrapStyle: {
            type: [String, Object, Array],
            default: '',
        },
        wrapClass: {
            type: [String, Object, Array],
            default: '',
        },
        viewClass: {
            type: [String, Object, Array],
            default: '',
        },
        viewStyle: {
            type: [String, Array, Object],
            default: '',
        },
        noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
        tag: {
            type: String,
            default: 'div',
        },
        always: {
            type: Boolean,
            default: false,
        },
        minSize: {
            type: Number,
            default: 20,
        },
    },
    data() {
        return {
            wrapElement: null,
            scrollbarElement: null,
            sizeWidth: '0',
            sizeHeight: '0',
            moveX: 0,
            moveY: 0,
            ratioY: 1,
            ratioX: 1,
            SCOPE: 'ElScrollbar',
            GAP: 4, // top 2 + bottom 2 of bar instance
        };
    },
    computed: {
        style() {
            const style = {};
            if (this.height) style.height = addUnit(this.height);
            if (this.maxHeight) style.maxHeight = addUnit(this.maxHeight);
            return [this.wrapStyle, style];
        },
    },
    watch: {
        noresize: {
            immediate: true,
            handler: function(noresize) {
                if (noresize) {
                    if (this.observer) {
                        this.observer.disconnect();
                        this.observer = null;
                    }
                    window.removeEventListener('resize', this.update);
                } else {
                    this.$nextTick(()=>{
                        const isSupported = window && 'ResizeObserver' in window;
                        if (isSupported) {
                            this.observer = new window.ResizeObserver(this.update);
                            this.observer.observe(this.$refs.resize$);
                        }
                        window.addEventListener('resize', this.update);
                    });
                }
            },
        },
    },
    mounted() {
        this.scrollbarElement = this.$refs.scrollbar$;
        this.wrapElement = this.$refs.wrap$;
        if (!this.native) this.$nextTick(() => this.update());
    },
    methods: {
        handleScroll() {
            if (this.wrapElement) {
                const offsetHeight = this.wrapElement.offsetHeight - this.GAP;
                const offsetWidth = this.wrapElement.offsetWidth - this.GAP;

                this.moveY =
                    ((this.wrapElement.scrollTop * 100) / offsetHeight) *
                    this.ratioY;
                this.moveX =
                    ((this.wrapElement.scrollLeft * 100) / offsetWidth) *
                    this.ratioX;

                this.$emit('scroll', {
                    scrollTop: this.wrapElement.scrollTop,
                    scrollLeft: this.wrapElement.scrollLeft,
                });
            }
        },
        setScrollTop(value) {
            if (!isNumber(value)) {
                throw TypeError('[md-scrollbar] value must be a number');
                // eslint-disable-next-line no-unreachable
                return;
            }
            this.wrapElement.scrollTop = value;
        },
        setScrollLeft(value) {
            if (!isNumber(value)) {
                throw TypeError('[md-scrollbar] value must be a number');
                // eslint-disable-next-line no-unreachable
                return;
            }
            this.wrapElement.scrollLeft = value;
        },
        update() {
            if (!this.wrapElement) return;

            const offsetHeight = this.wrapElement.offsetHeight - this.GAP;
            const offsetWidth = this.wrapElement.offsetWidth - this.GAP;

            const originalHeight =
                offsetHeight ** 2 / this.wrapElement.scrollHeight;
            const originalWidth =
                offsetWidth ** 2 / this.wrapElement.scrollWidth;
            const height = Math.max(originalHeight, this.minSize);
            const width = Math.max(originalWidth, this.minSize);

            this.ratioY =
                originalHeight /
                (offsetHeight - originalHeight) /
                (height / (offsetHeight - height));
            this.ratioX =
                originalWidth /
                (offsetWidth - originalWidth) /
                (width / (offsetWidth - width));

            this.sizeHeight =
                height + this.GAP < offsetHeight ? `${height}px` : '';
            this.sizeWidth = width + this.GAP < offsetWidth ? `${width}px` : '';
        },
    },
    beforeDestroy() {
        this.observer&&this.observer.disconnect();
        window.removeEventListener('resize', this.update);
    }
};
</script>
