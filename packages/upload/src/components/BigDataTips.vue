<template>
    <!-- 数据量大提示弹窗 -->
    <div class="vantop--upload-big-data-tips">
        <div class="tips-head">
            <i class="el-icon-warning"></i>
            <span class="head-text">数据量较大，可关闭弹窗进入后台导入</span>
            <el-link
                type="primary"
                :underline="false"
                class="go-to"
                @click="goTo"
            >
                <span>立即前往</span>
                <i class="el-icon-s-promotion"></i>
            </el-link>
        </div>
        <div class="tips-footer">
            可以通过 - 设置模块 / 导入导出任务 - 页面查看正在进行的任务。
        </div>
    </div>
</template>

<script>
export default {
    name: 'BigDataTips',
    methods: {
        goTo() {
            this.$router.push(this.taskUrl);
        }
    },
    computed: {
        taskUrl() {
            return this.Admin.taskUrl;
        }
    }
};
</script>
