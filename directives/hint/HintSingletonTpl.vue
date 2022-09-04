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

<style lang="scss">
.hint_directive_popper {
    white-space: pre-wrap;
}
</style>