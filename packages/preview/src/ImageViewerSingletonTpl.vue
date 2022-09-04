<!--
 * @Author: lingyong.zeng
 * @Date: 2022-06-16 15:32:16
 * @LastEditors: lingyong.zeng
 * @LastEditTime: 2022-06-16 15:43:13
 * @Description:
 * @FilePath: /vantop-ui/packages/preview/src/ImageViewerSingletonTpl.vue
-->
<template>
    <el-image-viewer
        v-show="visible"
        :z-index="2000"
        :initial-index="0"
        :on-close="closeViewer"
        :url-list="[url]"
    />
</template>

<script>
export default {
    props: {
        url: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            visible: false,
            prevOverflow: null,
        };
    },
    methods: {
        showViewer() {
            this.prevOverflow = document.body.style.overflow;
            this.visible = true;
        },
        closeViewer() {
            document.body.style.overflow = this.prevOverflow;
            this.visible = false;
        },
    }
};
</script>