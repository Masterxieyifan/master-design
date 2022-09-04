<template>
    <div :class="['fix-bar--wrapper', { fixed: isFixed }]">
        <span class="title">{{ title }}</span>
        <span
            class="status-button"
            v-if="statusButtonOptions.text"
            :style="[
                { color: statusButtonOptions.color },
                { backgroundColor: statusButtonOptions.bgColor },
            ]"
            >{{ statusButtonOptions.text }}</span
        >
        <div class="button-box">
            <slot>
                <el-button
                    v-if="hasCancel"
                    :loading="cancelLoading"
                    size="small"
                    plain
                    @click="handleCancel"
                    >取消</el-button
                >
                <el-button
                    v-if="hasEdit"
                    :loading="editLoading"
                    size="small"
                    plain
                    @click="handleEdit"
                    >编辑</el-button
                >
            </slot>
        </div>
    </div>
</template>
<script>
export default {
    name: 'MdStickyHeader',
    props: {
        title: {
            type: String,
            default: ''
        },
        statusButtonOptions: {
            type: Object,
            default: () => ({
                text: '',
                bgColor: '',
                color: '',
            }),
        },
        hasCancel: {
            type: Boolean,
            default: true,
        },
        hasEdit: {
            type: Boolean,
            default: true,
        },
        cancelLoading: {
            type: Boolean,
            default: false,
        },
        editLoading: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            isFixed: false,
        };
    },
    mounted() {
        window.addEventListener('scroll', this.scroll);
    },
    methods: {
        handleCancel() {
            this.$emit('cancel');
        },
        handleEdit() {
            this.$emit('edit');
        },
        scroll() {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset;
            if (scrollTop) {
                this.isFixed = true;
            } else {
                this.isFixed = false;
            }
        },
        beforeDestroy() {
            window.removeEventListener('scroll', this.scroll);
        }
    }
};
</script>