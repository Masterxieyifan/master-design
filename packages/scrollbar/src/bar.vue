<!--
 * @Descripttion:
 * @Author: 蔡远程
 * @Date: 2021-12-23 15:38:14
 * @LastEditTime: 2021-12-23 18:26:29
 * @LastEditors: 蔡远程
-->
<template>
    <transition name="md-scrollbar-fade">
        <div
            v-show="always || visible"
            ref="instance"
            :class="['md-scrollbar__bar', 'is-' + bar.key]"
            @mousedown="clickTrackHandler"
        >
            <div
                ref="thumb"
                class="md-scrollbar__thumb"
                :style="thumbStyle"
                @mousedown="clickThumbHandler"
            ></div>
        </div>
    </transition>
</template>

<script>
import { BAR_MAP, renderThumbStyle } from './util';
export default {
    name: 'MdBar',
    props: {
        vertical: Boolean,
        size: String,
        move: Number,
        ratio: {
            type: Number,
            required: true,
        },
        always: Boolean,
    },
    inject: ['scrollbar'],
    data() {
        return {
            instance: null,
            thumb: null,
            barStore: {},
            visible: false,
            cursorDown: false,
            cursorLeave: false,
            onselectstartStore: null,
        };
    },
    computed: {
        bar() {
            return BAR_MAP[this.vertical ? 'vertical' : 'horizontal'];
        },
        thumbStyle() {
            return renderThumbStyle({
                size: this.size,
                move: this.move,
                bar: this.bar,
            });
        },
        offsetRatio() {
            return (
                this.instance[this.bar.offset] ** 2 /
                this.scrollbar.wrapElement[this.bar.scrollSize] /
                this.ratio /
                this.thumb[this.bar.offset]
            );
        },
    },
    mounted() {
        if (!this.scrollbar)
            throw Error('[MdBar] can not inject scrollbar context');
        this.thumb = this.$refs.thumb;
        this.instance = this.$refs.instance;
        this.$nextTick(()=>{
            this.scrollbar.scrollbarElement.addEventListener('mousemove', this.mouseMoveScrollbarHandler);
            this.scrollbar.scrollbarElement.addEventListener('mouseleave', this.mouseLeaveScrollbarHandler);
        });
    },
    beforeDestroy() {
        this.scrollbar.scrollbarElement.removeEventListener('mousemove', this.mouseMoveScrollbarHandler);
        this.scrollbar.scrollbarElement.removeEventListener('mouseleave', this.mouseLeaveScrollbarHandler);
    },
    methods: {
        clickTrackHandler(e) {
            const { thumb, bar, instance, scrollbar, offsetRatio } = this;
            if (!thumb || !instance || !scrollbar.wrapElement) return;

            const offset = Math.abs(
                e.target.getBoundingClientRect()[bar.direction] - e[bar.client]
            );
            const thumbHalf = thumb[bar.offset] / 2;
            const thumbPositionPercentage =
                ((offset - thumbHalf) * 100 * offsetRatio) /
                instance[bar.offset];

            scrollbar.wrapElement[bar.scroll] =
                (thumbPositionPercentage *
                    scrollbar.wrapElement[bar.scrollSize]) /
                100;
        },
        clickThumbHandler(e) {
            const { bar, barStore } = this;
            // prevent click event of middle and right button
            e.stopPropagation();
            if (e.ctrlKey || [1, 2].includes(e.button)) return;

            window.getSelection()?.removeAllRanges();
            this.startDrag(e);

            const el = e.currentTarget;
            if (!el) return;
            barStore[bar.axis] =
                el[bar.offset] -
                (e[bar.client] - el.getBoundingClientRect()[bar.direction]);
        },
        startDrag(e) {
            e.stopImmediatePropagation();
            this.cursorDown = true;
            document.addEventListener(
                'mousemove',
                this.mouseMoveDocumentHandler
            );
            document.addEventListener('mouseup', this.mouseUpDocumentHandler);
            this.onselectstartStore = document.onselectstart;
            document.onselectstart = () => false;
        },
        mouseMoveDocumentHandler(e) {
            const {
                instance,
                thumb,
                cursorDown,
                bar,
                barStore,
                offsetRatio,
                scrollbar,
            } = this;
            if (!instance || !thumb) return;
            if (cursorDown === false) return;

            const prevPage = barStore[bar.axis];
            if (!prevPage) return;

            const offset =
                (instance.getBoundingClientRect()[bar.direction] -
                    e[bar.client]) *
                -1;
            const thumbClickPosition = thumb[bar.offset] - prevPage;
            const thumbPositionPercentage =
                ((offset - thumbClickPosition) * 100 * offsetRatio) /
                instance[bar.offset];
            scrollbar.wrapElement[bar.scroll] =
                (thumbPositionPercentage *
                    scrollbar.wrapElement[bar.scrollSize]) /
                100;
        },
        mouseUpDocumentHandler() {
            this.cursorDown = false;
            this.barStore[this.bar.axis] = 0;
            document.removeEventListener('mousemove', this.mouseMoveDocumentHandler);
            document.removeEventListener('mouseup', this.mouseUpDocumentHandler);
            document.onselectstart = this.onselectstartStore;
            if (this.cursorLeave) this.visible = false;
        },
        mouseMoveScrollbarHandler() {
            this.cursorLeave = false;
            this.visible = !!this.size;
        },
        mouseLeaveScrollbarHandler() {
            this.cursorLeave = true;
            this.visible = this.cursorDown;
        }
    },
};
</script>
