<template>
    <div class="vantop-upload-wrapper">
        <div class="vantop--upload--item">
            <!-- 导入按钮 -->
            <Upload
                v-if="$slots['import-button']"
                ref="VantopUpload"
                :drag="false"
                v-bind="$attrs"
                v-on="$listeners"
            >
                <slot name="import-button">
                    上传附件
                </slot>
            </Upload>

            <!-- 打开导入弹窗 -->
            <span v-if="$slots['import-dialog']" @click="handleVisible(true)">
                <slot name="import-dialog">
                    打开导入弹窗
                </slot>
            </span>

            <!-- 打开导出数据弹窗 -->
            <span
                v-if="$slots['export-data']"
                @click="handleExportDataVisible(true)"
            >
                <slot name="export-data">
                    导出数据
                </slot>
            </span>
        </div>

        <!-- 导入弹窗 -->
        <ImportDialog v-show="visible"></ImportDialog>

        <!-- 正在导入 & 导入结果 弹窗 -->
        <ImportingDialog v-show="importingVisible"></ImportingDialog>

        <!-- 导出数据弹窗 -->
        <ExportDataDialog v-show="exportDataVisible"></ExportDataDialog>
    </div>
</template>

<script>
import {
    download,
    importDetail,
    importFile,
    importResultGet,
    exportCount,
    exportData,
    exportTaskGet
} from './api/importExportPlatform';

import Upload from './components/Upload.vue';
import ExportDataDialog from './components/ExportDataDialog.vue';
import ImportDialog from './components/ImportDialog.vue';
import ImportingDialog from './components/ImportingDialog.vue';

export default {
    name: 'MdUpload',
    components: {
        Upload,
        ExportDataDialog,
        ImportDialog,
        ImportingDialog
    },
    model: {
        prop: 'value',
        event: 'input'
    },
    provide() {
        return {
            Admin: this
        };
    },
    props: {
        // 上传的文件列表
        value: {
            type: Array,
            default: () => []
        },
        // 导出数据(表单筛选参数)
        exportCountForm: {
            type: Object,
            default: () => ({})
        },
        // 业务场景 id
        sceneId: {
            type: String,
            default: ''
        },
        // 是否显示导出数据弹窗-继续导出按钮
        importBtn: {
            type: Boolean,
            default: true
        },
        // 上传的地址
        action: {
            type: String,
            default: '//api.nextop.cc/filecenter/file/import/list'
        },
        // 设置上传的请求头部
        headers: {
            type: Object,
            default: () => ({
                // eslint-disable-next-line max-len
                // Authorization: 'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIxIiwidGVuYW50SWQiOiIxNTk2ODcwNjY5Mjc4Iiwic3ViIjoiTW96aWxsYVwvNS4wIChNYWNpbnRvc2g7IEludGVsIE1hYyBPUyBYIDEwXzE1XzcpIEFwcGxlV2ViS2l0XC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWVcLzkyLjAuNDUxNS4xNTkgU2FmYXJpXC81MzcuMzYiLCJleHAiOjE2MzAwNDc0MDYsInJlZnJlc2hUaW1lIjoxNjMwMDQ2MjA2fQ.uhA1OTNVHf0q5ZSG8-h_94tR8NA0BXiogaB2Q4ge9mk'
                authorization:
                    'Bearer ' +
                        JSON.parse(
                            localStorage.getItem('nextop-micro:TOKEN')
                        ) || localStorage.getItem('token')
            })
        },
        // 租户 tenantId
        tenantId: {
            type: String,
            default: () =>
                //  '1596870669278'
                JSON.parse(localStorage.getItem('nextop-micro:USER_INFO'))
                    ?.defaultTenantId || localStorage.getItem('tenantId')
        },
        // 前往设置模块-导入导出任务-查看导出任务列表 url
        taskUrl: {
            type: String,
            default: 'https://www.nextop.cc/system/import-and-export/index'
        },
        // 允许上传的文件后缀名列表
        suffixList: {
            type: Array,
            default: () => ['.xlsx']
        },
        // 上传文件大小限制 MB
        fileSize: {
            type: Number,
            default: () => 20
        }
    },
    data() {
        return {
            // vantop-upload
            name: 'files',
            withCredentials: true,
            showFileList: true,
            listType: 'text',
            autoUpload: true,
            drag: true,
            // vantop-upload

            // 导入按钮 loading
            importLoading: false,
            // loading
            loading: false,
            // 计数器
            count: 0,
            // 定时器
            timer: null,
            // 文件列表
            fileList: [],
            // 导出数据弹窗
            exportDataVisible: false,
            // 导入结果数组
            importResultList: [],
            // 是否为正在导入
            importing: false,
            // 正在导入弹窗
            importingVisible: false,
            // 导入弹窗显示
            visible: false,
            // 导入场景查询
            options: {
                sceneName: '导入场景',
                // 导入模板列表
                importUrlMappingList: []
            },
            info: {
                count: 0
            }
        };
    },
    computed: {
        eachLimit() {
            return this.options.eachLimit || 0;
        }
    },
    watch: {
        value: {
            immediate: true,
            handler(value) {
                this.fileList = value;
            }
        },
        fileList: {
            handler(fileList) {
                this.$emit('input', fileList);
            }
        },
        visible(visible) {
            if (visible) {
                this.importDetail();
            } else {
                this.fileList = [];
            }
        }
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
    methods: {
        handleVisible(visible) {
            this.visible = visible;
        },
        handleImportingVisible(visible) {
            this.importingVisible = visible;
        },
        handleExportDataVisible(visible) {
            this.exportDataVisible = visible;
        },
        success(success) {
            // console.log(success);
            const { code, responseCode, message } = success;
            // 文件上传失败
            if (
                (code && code !== '000000') ||
                (responseCode && responseCode !== '10000')
            ) {
                this.fileList.pop();
                this.$message.error(message);
                this.$emit('error', success);
                return false;
            }
            this.$emit('success', success);
        },
        error(error) {
            this.$emit('error', error);
        },
        // 下载文件
        download(fileId) {
            const queryData = {
                fileId
            };
            download(queryData);
        },
        // 导入功能按钮
        importFile() {
            const queryData = {
                importUrlList: this.fileList,
                sceneId: this.sceneId,
                tenantId: this.tenantId
            };
            this.count = 0;
            this.importLoading = true;
            importFile(queryData)
                .then(res => {
                    if (this.timer) {
                        clearInterval(this.timer);
                    }
                    this.timer = setInterval(() => {
                        this.importResultGet(res.data.data);
                    }, 2000);
                })
                .finally(() => {
                    this.$emit('importFile');
                    this.importLoading = true;
                });
        },
        // 导入任务状态查询
        importResultGet(taskId) {
            if (!taskId) return;

            const queryData = {
                taskId
            };

            importResultGet(queryData)
                .then(res => {
                    if (this.timer) {
                        clearInterval(this.timer);
                    }

                    this.count++;

                    this.importingVisible = true;
                    this.importResultList = res.data;

                    this.importing = this.importResultList?.every(
                        v => v.status !== 2
                    );

                    if (this.count > 4 || !this.importing) {
                        clearInterval(this.timer);
                        return;
                    }
                })
                .finally(() => {
                    this.importLoading = false;
                });
        },
        // 导入场景详情
        importDetail() {
            const queryData = {
                sceneId: this.sceneId
            };
            this.loading = true;
            importDetail(queryData)
                .then(res => {
                    if (res.data.data) {
                        this.options = res.data.data;
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 导出数量统计
        exportCount() {
            const { sceneId, exportCountForm } = this;
            const queryData = {
                sceneId,
                exportCountForm: {
                    ...exportCountForm,
                    conditionStr: JSON.stringify(exportCountForm.conditionStr)
                }
            };
            exportCount(queryData).then(res => {
                this.info.count = res.data.data;
            });
        },
        // 导出数据
        exportData() {
            const {
                sceneId,
                tenantId,
                exportCountForm: { conditionStr }
            } = this;

            const queryData = {
                exportForm: {
                    conditionStr: JSON.stringify(conditionStr)
                },
                sceneId,
                tenantId
            };

            this.count = 0;
            this.loading = true;
            exportData(queryData)
                .then(res => {
                    if (res.data.data) {
                        if (this.timer) {
                            clearInterval(this.timer);
                        }
                        this.timer = setInterval(() => {
                            this.exportTaskGet({ taskId: res.data.data });
                        }, 1000);
                    }
                })
                .finally(() => {
                    this.$emit('exportData');
                    this.loading = false;
                });
        },
        // 导出任务状态查询
        exportTaskGet(queryData) {
            exportTaskGet(queryData).then(res => {
                const { fileId } = res.data.data;
                this.count++;
                if (fileId) {
                    clearInterval(this.timer);
                    this.download(fileId);
                    this.exportDataVisible = false;
                    return;
                }
                if (this.count > 4) {
                    clearInterval(this.timer);
                }
            });
        }
    }
};
</script>
