<!--
 * @Author: Shixin
 * @Date: 2021-12-16 11:34:25
 * @LastEditors: Shixin
 * @LastEditTime: 2021-12-16 12:06:27
 * @Description: Do not edit
 * @FilePath: /master-design/packages/loading-button/src/main.vue
 * 🍻 Write code drunkenly.
-->
<template>
    <el-button
        v-on="$listeners"
        v-bind="$attrs"
        :loading="selfLoading"
        @click.stop.prevent="handleClick"
    >
        <slot></slot>
    </el-button>
</template>

<script>
export default {
    name: 'MdLoadingButton',
    inject: {
        elForm: {
            default: '',
        },
        elFormItem: {
            default: '',
        },
    },
    props: {
        loading: Boolean,
        loadingClick: {
            type: Function,
            required: true,
        },
    },
    data() {
        return {
            selfLoading: this.loading,
        };
    },
    watch: {
        loading(val) {
            this.selfLoading = val;
        },
    },
    methods: {
        handleClick(evt) {
            this.selfLoading = true;
            window.Promise.resolve(this.loadingClick(evt))
                .catch(() => {
                    //
                })
                .finally(() => {
                    this.selfLoading = false;
                });
        },
    },
};
</script>
