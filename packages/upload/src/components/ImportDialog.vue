<template>
    <!-- 导入弹窗 -->
    <el-dialog
        :title="uploadDialogTitle"
        :visible="visible"
        @close="close"
        custom-class="vantop--upload-import-dialog el-dialogue--wrapper"
        top="0"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
        width="600px"
    >
        <div class="step-1">
            <div class="head-title ">一. 下载导入模板</div>
            <div class="template-list-wrapper">
                <div class="step-1-text">根据提示完善表格内容</div>
                <div
                    v-for="item in options.importUrlMappingList"
                    :key="item.id"
                    class="template-list-item"
                >
                    <el-link
                        type="primary"
                        :underline="false"
                        @click="download(item.fileId)"
                    >
                        {{ item.fileName }}
                    </el-link>
                </div>
            </div>
        </div>
        <div class="step-2">
            <div class="head-title">二. 上传文件</div>
            <div class="import-rule-desc">{{ options.importRuleDesc }}</div>
        </div>
        <Upload
            ref="VantopUpload"
            list-type="text"
            multiple
            drag
            :accept="accept"
        >
        </Upload>
        <span slot="footer">
            <el-button type="info" size="small" plain @click="close"
                >取 消</el-button
            >
            <el-button
                :loading="loading"
                size="small"
                plain
                type="primary"
                @click="importFile"
                :disabled="fileList.length < 1"
            >
                导 入
            </el-button>
        </span>
    </el-dialog>
</template>

<script>
import Upload from './Upload.vue';

export default {
    name: 'ImportDialog',
    inject: ['Admin'],
    components: {
        Upload
    },
    beforeDestroy() {
        clearInterval(this.Admin.timer);
    },
    computed: {
        fileList() {
            return this.Admin.fileList;
        },
        accept() {
            return this.options.fileType ? `.${this.options.fileType}` : '';
        },
        loading() {
            return this.Admin.importLoading;
        },
        sceneId() {
            return this.Admin.sceneId;
        },
        tenantId() {
            return this.Admin.tenantId;
        },
        options() {
            return this.Admin.options;
        },
        visible() {
            return this.Admin.visible;
        },
        uploadDialogTitle() {
            return this.Admin.options ? this.Admin.options.sceneName : '导入';
        }
    },
    methods: {
        // 导入功能按钮
        importFile() {
            this.Admin.importFile();
        },
        // 下载模板
        download(fileId) {
            this.Admin.download(fileId);
        },
        open() {
            this.Admin.visible = true;
        },
        close() {
            this.Admin.visible = false;
        }
    }
};
</script>
