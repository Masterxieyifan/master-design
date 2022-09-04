<!--
 * @Descripttion: 全屏组件
 * @Author: 蔡远程
 * @Date: 2022-04-01 16:07:25
 * @LastEditTime: 2022-04-01 17:55:20
 * @LastEditors: 蔡远程
-->
<template>
    <div
        class="md-fullscreen"
        :style="wrapperStyle"
        :class="wrapperClass"
    >
        <slot></slot>
    </div>
</template>

<script>
import { nextZIndex } from 'element-ui';
export default {
    name: 'MdFullscreen',
    model: {
        prop: 'fullscreen',
        event: 'input'
    },
    props: {
        fullscreen: {
            type: Boolean,
            default: false,
        },
        appendToBody: {
            type: Boolean,
            default: false,
        },
        closeOnPressEscape: {
            type: Boolean,
            default: true,
        },
        fullClass: {
            type: String,
            default: ''
        },
        normalClass: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            zIndex: null,
            $parentNode: null,
        };
    },
    computed: {
        wrapperStyle() {
            let style = undefined;
            if (this.fullscreen) {
                style = {
                    position: 'fixed',
                    left: '0',
                    top: '0',
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#fff',
                    zIndex: this.zIndex
                };
            }
            return style;
        },
        wrapperClass() {
            return this.fullscreen ? this.fullClass : this.normalClass;
        }
    },
    watch: {
        fullscreen(val) {
            if (val) {
                this.zIndex = nextZIndex();
                if (this.appendToBody) document.body.appendChild(this.$el);
                this.$emit('full');
            } else {
                if (this.appendToBody && this.$parentNode) {
                    document.body.removeChild(this.$el);
                    this.$parentNode.appendChild(this.$el);
                }
                this.$emit('exit');
            }
        }
    },
    mounted() {
        this.$parentNode = this.$el.parentNode;
        if (this.fullscreen) {
            this.zIndex = nextZIndex();
            if (this.appendToBody) document.body.appendChild(this.$el);
        }
        this.closeOnPressEscape && window.addEventListener('keydown', this.handlePressEscape);
    },
    beforeDestroy() {
        this.closeOnPressEscape && window.removeEventListener('keydown', this.handlePressEscape);
    },
    methods: {
        handlePressEscape(event) {
            if (event.keyCode === 27 && this.fullscreen) {
                this.$emit('input', false);
                this.$emit('exit');
            }
        }
    }
};
</script>
