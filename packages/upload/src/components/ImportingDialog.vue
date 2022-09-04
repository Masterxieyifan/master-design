<template>
    <!-- 正在导入弹窗 -->
    <el-dialog
        :title="importingDialogTitle"
        :visible="importingVisible"
        @close="close"
        custom-class="vantop--upload-importing-dialog el-dialogue--wrapper"
        top="0"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
        width="600px"
    >
        <div class="importing-file-list">
            <div
                class="list-item"
                v-for="item in importResultList"
                :key="item.id"
            >
                <i
                    v-if="item.errorFileUrl || item.result === '导入执行失败'"
                    :class="['md-icon-danger-fill-16', 'error']"
                >
                </i>
                <i v-else :class="['md-icon-success-16', 'success']"> </i>
                <el-tooltip
                    :disabled="!item.fileName"
                    class="file-name"
                    effect="dark"
                    :content="item.fileName"
                    placement="top"
                >
                    <span>{{ item.fileName || '-' }}</span>
                </el-tooltip>
                <template v-if="item.errorFileUrl">
                    <div class="file-status-text">
                        <span class="error">{{ item.result }}</span>
                        <i
                            class="md-icon-download-16"
                            @click="download(item)"
                        ></i>
                    </div>
                </template>
                <div v-else class="file-status-text">{{ item.result }}</div>
            </div>
        </div>
        <BigDataTips v-if="count > 4"></BigDataTips>
        <span slot="footer" v-if="importBtn">
            <el-button
                :disabled="importing"
                size="small"
                plain
                @click="handleImportAgain"
            >
                继续导入
            </el-button>
            <el-button
                :disabled="importing"
                size="small"
                plain
                type="primary"
                @click="handleImportingVisible(false)"
            >
                完 成
            </el-button>
        </span>
    </el-dialog>
</template>

<script>
import BigDataTips from './BigDataTips.vue';

export default {
    name: 'ImportingDialog',
    inject: ['Admin'],
    components: {
        BigDataTips
    },
    data() {
        return {
            statusMap: {
                0: 'wait',
                1: 'loading',
                2: 'success',
                3: 'error'
            },
            statusIconMap: {
                0: 'info',
                1: 'loading',
                2: 'success',
                3: 'error'
            }
        };
    },
    computed: {
        importBtn() {
            return this.Admin.importBtn;
        },
        count() {
            return this.Admin.count;
        },
        importing() {
            return this.Admin.importing;
        },
        importResultList() {
            return this.Admin.importResultList;
        },
        importingDialogTitle() {
            return this.Admin.importing ? '正在导入' : '导入结果';
        },
        importingVisible() {
            return this.Admin.importingVisible;
        }
    },
    methods: {
        handleImportingVisible(visible) {
            if (visible === false) {
                this.Admin.fileList = [];
            }
            this.Admin.importingVisible = visible;
        },
        handleImportAgain() {
            this.Admin.visible = true;
            this.handleImportingVisible(false);
        },
        download(item) {
            this.Admin.download(item.fileId);
        },
        close() {
            this.handleImportingVisible(false);
        }
    }
};
</script>
