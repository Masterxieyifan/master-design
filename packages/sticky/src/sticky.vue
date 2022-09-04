<!--
 * @Author: hongdong.liao
 * @Date: 2021-02-24 14:25:59
 * @LastEditors: 蔡远程
 * @LastEditTime: 2021-10-08 16:49:02
-->
<template>
<div class="vantop-global-stick-bottom--box" :style="style">
    <el-button v-if="hasCancel" size="small" plain @click="handleCancel">{{cancelText}}</el-button>
    <slot></slot>
    <el-button v-if="hasConfirm" size="small" type="primary" @click="handleSave" :disabled="disabled">{{confirmText}}</el-button>
</div>
</template>
<script>

export default {
    name: 'MdSticky',
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
        cancelText: {
            type: String,
            default: '取消',
        },
        confirmText: {
            type: String,
            default: '保存',
        },
        hasCancel: {
            type: Boolean,
            default: true,
        },
        hasConfirm: {
            type: Boolean,
            default: true,
        },
        offset: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            observer: null,
            sideBarWidth: 0
        };
    },
    computed: {
        style() {
            return {
                left: `${this.offset}px`,
                width: this.sideBarWidth ? `calc(100% - ${this.sideBarWidth}px)` : null,
                transform: this.sideBarWidth ? `translate(${this.sideBarWidth}px)` : null
            };
        }
    },
    mounted() {
        const targetNode = document.querySelector('#sidebar--wrapper');
        if (targetNode) {
            this.sideBarWidth = targetNode.getAttribute('data-sidebar-width') || 0;
            // 观察器的配置（需要观察什么变动）
            const config = {
                attributes: true,
            };
            // 当观察到变动时执行的回调函数
            const callback = mutationsList => {
                // Use traditional 'for loops' for IE 11
                mutationsList.forEach(mutation => {
                    if (mutation.attributeName === 'data-sidebar-width' && mutation.type === 'attributes') {
                        const width = JSON.parse(mutation.target.getAttribute('data-sidebar-width'));
                        if (this.sideBarWidth !== width) this.sideBarWidth = width;
                    }
                });
            };
            // 创建一个观察器实例并传入回调函数
            this.observer = new MutationObserver(callback);
            // 以上述配置开始观察目标节点
            this.observer?.observe(targetNode, config);
        }
    },
    destroyed() {
        // 之后，可停止观察
        this.observer?.disconnect();
    },
    methods: {
        handleCancel() {
            this.$emit('cancel');
        },
        handleSave() {
            this.$emit('confirm');
        },
    }
};
</script>
