<!--
 * @Author: lingyong.zeng
 * @Date: 2022-06-16 14:41:53
 * @LastEditors: lingyong.zeng
 * @LastEditTime: 2022-06-16 15:19:13
 * @Description:
 * @FilePath: /vantop-ui/packages/preview/src/PreviewSingletonTpl.vue
-->
<template>
    <el-popover
        v-if="showProp"
        ref="pop"
        trigger="hover"
        placement="right-end"
        width="160"
        popper-class="img-previewer-popper--wrapper"
        :reference="reference"
        :open-delay="600"
    >
        <img
            v-if="url"
            class="img-preview--popper__img"
            referrerPolicy="no-referrer"
            :src="url"
        />
    </el-popover>
</template>

<script>
export default {
    props: {
        showProp: {
            type: Boolean,
            default: false
        },
        reference: {
            type: Object,
            default: () => ({})
        },
        url: {
            type: String,
            default: () => ''
        }
    },
};
</script>