<template>
    <!-- 导出数据弹窗 -->
    <el-dialog
        title="导出数据"
        :visible="exportDataVisible"
        @close="close"
        custom-class="vantop--upload-export-data-dialog el-dialogue--wrapper"
        top="0"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
        width="600px"
    >
        <div class="dialog-text">
            <span>本次导出预计</span>
            <span class="count"> {{ info.count || 0 }} </span>
            <span>条数据</span>
        </div>
        <BigDataTips v-if="count > 4 && importBtn"></BigDataTips>
        <span slot="footer">
            <el-button type="info" size="small" plain @click="close"
                >取 消</el-button
            >
            <el-button
                v-if="importBtn"
                :disabled="!Number(info.count)"
                size="small"
                plain
                type="primary"
                :loading="loading"
                @click="exportData"
            >
                导 出
            </el-button>
        </span>
    </el-dialog>
</template>

<script>
import BigDataTips from './BigDataTips.vue';

export default {
    name: 'BigDataTips',
    components: {
        BigDataTips
    },
    inject: ['Admin'],
    data() {
        return {
            count: 0,
            timer: null
        };
    },
    computed: {
        info() {
            return this.Admin.info;
        },
        exportDataVisible() {
            return this.Admin.exportDataVisible;
        },
        exportCountForm() {
            return this.Admin.exportCountForm;
        },
        sceneId() {
            return this.Admin.sceneId;
        },
        tenantId() {
            return this.Admin.tenantId;
        },
        loading() {
            return this.Admin.loading;
        },
        importBtn() {
            return this.Admin.importBtn;
        }
    },
    watch: {
        exportDataVisible: {
            immediate: true,
            handler(exportDataVisible) {
                if (exportDataVisible){
                    this.exportCount();
                }
            }
        }
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
    methods: {
        // 导出数量统计
        exportCount() {
            this.Admin.exportCount();
        },
        exportData() {
            this.Admin.exportData();
        },
        close() {
            this.Admin.exportDataVisible = false;
        }
    }
};
</script>
