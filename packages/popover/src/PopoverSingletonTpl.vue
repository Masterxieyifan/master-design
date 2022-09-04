<!--
 * @Author: lingyong.zeng
 * @Date: 2022-06-14 10:52:52
 * @LastEditors: lingyong.zeng
 * @LastEditTime: 2022-06-14 14:26:10
 * @Description:
 * @FilePath: /vantop-ui/packages/popover/src/PopoverSingletonTpl.vue
-->
<template>
    <el-popover
        v-if="showProp"
        ref="pop"
        trigger="hover"
        :placement="placement"
        :reference="reference"
        :content="content"
        :popper-class="popperClass"
    >
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
        content: {
            type: String,
            default: ''
        },
        placement: {
            type: String,
            default: 'top'
        },
        popperClass: {
            type: String,
            default: ''
        }
    }
};
</script>