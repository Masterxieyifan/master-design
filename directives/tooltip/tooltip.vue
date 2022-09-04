<template>
    <el-tooltip
        :popper-class="'vantop-popover-direct' + className"
        :effect="effect"
        :placement="placement"
        :enterable="false"
        v-bind="rest"
    >
        <div slot="content">{{ content }}</div>
        <span :class="spanClass"></span>
    </el-tooltip>
</template>
<style lang="scss" scoped>
.dpib {
    display: inline-block;
}
</style>
