<!--
 * @Author: hongdong.liao
 * @Date: 2021-06-26 16:12:26
 * @LastEditors: lingyong.zeng
 * @LastEditTime: 2021-09-24 16:08:08
-->
<template>
    <el-tooltip
        :content="`条件已满足${$parent.$parent.$parent.filterMaxLen}个，请删除已显示条件再添加`"
        effect="dark"
        placement="top"
        :disabled="!maxDisabled"
        v-bind="$attrs"
        v-on="$listeners"
    >
        <el-tag
            :disable-transitions="true"
            v-bind="$attrs"
            v-on="$listeners"
            size="medium"
            class="condition-item"
            :class="{
                'is-disabled': maxDisabled && $attrs.disabled
            }"
            :type="{
                'active': 'success',
                'fixed': 'info',
                'disabled': 'info',
            }[status]"
            @close="handleClose"
        >
            {{ title }}
            <span
                v-if="$attrs.effect && !maxDisabled"
                class="condition-item-mask"
                @click="add"
            >
                添加
            </span>
        </el-tag>
    </el-tooltip>
</template>

<script>
export default {
    name: 'MdCustomConditionItem',
    props: {
        status: {
            type: String,
            default: 'normal'
        },
        title: {
            type: String,
            default: ''
        },
        maxDisabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {};
    },
    methods: {
        add() {
            this.$emit('item-add');
        },
        handleClose() {
            this.$emit('item-remove');
        },
    }
};
</script>

<style></style>
