<template>
<div>
    <template v-if="defaultTrigger">
        <span v-if="$slots['default']" @click="handleImportBtnClick">
            <slot></slot>
        </span>
        <el-button
            v-else
            type="info"
            :disabled="disabled"
            icon="md-icon-list-import"
            @click="handleImportBtnClick">{{title}}</el-button>
    </template>
    <!-- 导入 -->
    <el-dialog
        class="import-dialogue--wrapper"
        :title="title"
        :visible="__visible"
        append-to-body
        custom-class="el-dialogue--wrapper"
        top="0"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="600px"
        @close="handleImportCancel"
        v-loading="importUploading"
    >
        <div class="inner--wrapper" v-loading="uploading">
            <div
                v-if="hasDownloadTemplate"
                class="instruction--wrapper first-section"
            >
                <div class="instruction--left">
                    <div class="title">下载导入模版</div>
                    <div class="subtitle">{{downloadTemplateText}}</div>
                </div>
                <div class="instruction--right">
                    <slot name="downloadTemplate">
                        <el-button
                            plain
                            icon="md-icon-download-16"
                            @click="handleDownloadTemplate">下载模版</el-button>
                    </slot>
                </div>
            </div>
            <div class="instruction--wrapper second-section">
                <div class="title">上传文件</div>
                <div class="hint subtitle">
                    <div v-for="(i, idx) in hints" :key="idx">
                        {{i}}
                    </div>
                </div>
            </div>
            <el-upload
                ref="locationRef"
                class="upload-section"
                drag
                @drop.native.prevent="onDrag"
                :multiple="true"
                :action="uploadUrl"
                :auto-upload="__autoUpload"
                :accept="accept"
                :headers="assignHeaderData"
                :before-upload="beforeUpload"
                :on-success="handleSuccess"
                :on-error="onError"
                :on-remove="handleFileDelete"
                :file-list="form.fileList"
                :limit="limit"
                :on-exceed="onExceed"
                :on-change="handleFileChange"
                with-credentials
                :data="data"
            >
                <i class="el-upload--drag__icon"/>
                <div class="el-upload--drag__text">将文件拖拽至框内上传，或<em>浏览文件</em></div>
                <div class="el-upload--drag__tip">{{acceptText}}</div>
            </el-upload>
        </div>
        <template slot="footer">
            <el-button
                type="info"
                size="small"
                @click="handleImportCancel">取消</el-button>
            <el-button
                size="small"
                type="primary"
                :disabled="form.fileList.length === 0 || importUploading"
                @click="handleImport">导入</el-button>
        </template>
    </el-dialog>
    <!-- import result -->
    <el-dialog
        class="import-result-dialogue--wrapper"
        :title="resultTitle"
        :visible.sync="isShowResult"
        append-to-body
        custom-class="el-dialogue--wrapper"
        top="0"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="600px"
    >
        <div class="content--wrapper">
            <!-- #TODO loading style -->
            <div class="content--item" v-for="(result, idx) in resultData" :key="idx">
                <template  v-if="result.failedCo === 0">
                    <div class="file-name--box">
                        <i class="iconfont icon-line-success success"></i>
                        <span class="file-name">{{result.fileName}}</span>
                    </div>
                    <div class="file-status--box text success">成功导入{{result.successedCo}}条数据</div>
                </template>
                <template v-else-if="result.failedCo >0">
                    <div class="file-name--box">
                        <i class="iconfont icon-warning failed"></i>
                        <span class="file-name">{{result.fileName}}</span>
                    </div>
                    <div class="file-status--box text">共{{result.total}}条数据，<span class="failed">失败{{result.failedCo}}条数据</span><i class="iconfont icon-download1" title="下载失败数据" @click="handleDownloadSingleFailedData(result)"></i></div>
                </template>
                <template v-else>
                    <div class="file-name--box">
                        <i class="iconfont" :class="{ success: result.success, 'icon-line-success': result.success, failed: !result.success, 'icon-warning': !result.success }"></i>
                        <span class="file-name">{{result.fileName}}</span>
                    </div>
                    <div class="file-status--box text">{{result.text}}</div>
                </template>
            </div>
            <div v-if="hasFailedData && hasDownloadAllFailedData" class="download-hint-text" @click="handleDownloadAllFailedData">下载全部失败数据<i class="iconfont icon-download1" title="下载失败数据"></i></div>
        </div>
        <template slot="footer">
            <el-button
                type="info"
                size="small"
                @click="handleContinueImport">继续导入</el-button>
            <el-button
                size="small"
                type="primary"
                @click="handleFinish">完成</el-button>
        </template>
    </el-dialog>
</div>
</template>

<script>

export default {
    name: 'MdImportDialogue',
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
        uploadUrl: {
            type: String,
            default: '',
        },
        title: {
            type: String,
            default: '导入',
        },
        resultTitle: {
            type: String,
            default: '导入结果',
        },
        accept: {
            type: String,
            default: '.xls, .xlsx',
        },
        acceptText: {
            type: String,
            default: '支持xlsx文件，文件不得大于2M，数据最多1000条',
        },
        // unit is MB
        size: {
            type: Number,
            default: 10,
        },
        limit: {
            type: Number,
            default: 10,
        },
        downloadTemplateText: {
            type: String,
            default: '根据提示信息完善表格内容，点击下载模板'
        },
        hasDownloadTemplate: {
            type: Boolean,
            default: false,
        },
        hasDownloadAllFailedData: {
            type: Boolean,
            default: false,
        },
        hints: {
            type: Array,
            default: () => [],
        },
        resultData: {
            type: Array,
            default: () => [],
        },
        headerData: {
            type: Object,
            default: () => ({}),
        },
        defaultTrigger: {
            type: Boolean,
            default: true
        },
        visible: {
            type: Boolean,
            default: false,
        },
        data: {
            type: Object,
            default: undefined
        },
        hasResult: {
            type: Boolean,
            default: true,
        }
    },
    data() {
        return {
            dialogVisible: false,
            uploading: false,
            importUploading: false,
            isShowResult: false,
            form: {
                fileList: [],
            },
            assignHeaderData: null,
        };
    },
    computed: {
        hasFailedData() {
            return this.resultData.some(i => i.failedCo > 0);
        },
        // #TODO adjust header data
        __headerData() {
            return {
                ...this.headerData,
                'x-ca-language': 'zh_CN',
            };
        },
        __autoUpload() {
            return !!this.uploadUrl;
        },
        __visible() {
            return this.defaultTrigger ? this.dialogVisible: this.visible;
        }
    },
    mounted() {
        this.__loadHeaders();
    },
    methods: {
        _openImportDialogue() {
            if (this.defaultTrigger) {
                this.dialogVisible = true;
            } else {
                this.$emit('update:visible', true);
            }
        },
        _closeImportDialogue() {
            this.resetData();
            if (this.defaultTrigger) {
                this.dialogVisible = false;
            } else {
                this.$emit('update:visible', false);
            }
        },
        _openResultDialogue() {
            this.isShowResult = true;
        },
        _closeResultDialogue() {
            this.isShowResult = false;
        },
        __loadHeaders() {
            this.assignHeaderData = Object.assign({}, this.__headerData);
            this.assignHeaderData['x-ca-language'] = 'zh_CN';
            this.assignHeaderData['x-ca-reqtime'] = new Date().getTime();
            this.assignHeaderData['x-ca-reqid'] = Math.random() + new Date().getTime();
        },
        handleDownloadTemplate() {
            this.$emit('downloadTemplate');
        },
        handleDownloadSingleFailedData(result) {
            this.$emit('downloadSingleFailedFile', result);
        },
        handleDownloadAllFailedData() {
            this.$emit('downloadAllFailedFile', this.resultData);
        },
        handleImportBtnClick() {
            if (this.disabled) return;
            this._openImportDialogue();
        },
        handleFileDelete(selectedFile) {
            this.form.fileList = this.form.fileList.filter(file => file.uid !== selectedFile.uid);
        },
        handleImportCancel() {
            this._closeImportDialogue();
            this.$emit('cancel');
        },
        handleResultCancel() {
            this._closeResultDialogue();
        },
        handleImport() {
            this.importUploading = true;
            this.$emit('import', this.importDone, this.form.fileList);
        },
        importDone(error) {
            if (error) {
                this.importUploading = false;
            } else {
                this.importUploading = false;
                this._closeImportDialogue();
                this.hasResult && this._openResultDialogue();
            }
        },
        handleContinueImport() {
            this._closeResultDialogue();
            this._openImportDialogue();
        },
        handleFinish() {
            this._closeResultDialogue();
        },
        onDrag(e) {
            const { files, } = e.dataTransfer;
            [].slice.call(files).forEach((file, idx) => {
                const { type, name, } = file;
                const baseType = type.replace(/\/.*$/, '');
                const extension = name.indexOf('.') > -1
                    ? `.${ name.split('.').pop() }`
                    : '';
                const isLegal = this.accept.split(',')
                    .map(type => type.trim())
                    .filter(type => type)
                    .some(acceptedType => {
                        if (/\..+$/.test(acceptedType)) {
                            return extension === acceptedType;
                        }
                        if (/\/\*$/.test(acceptedType)) {
                            return baseType === acceptedType.replace(/\/\*$/, '');
                        }
                        if (/^[^/]+\/[^/]+$/.test(acceptedType)) {
                            return type === acceptedType;
                        }
                        return false;
                    });
                if (isLegal) return;
                setTimeout(() => {
                    this.$message.error(`文件${name}不符合格式`);
                }, (idx + 1) * 300); // delay it's time, in case user drag mutiple files
            });
        },
        onExceed() {
            // regard on UI's design, the limitation is 10
            this.$message.warning(`最多只能上传${this.limit}个文件`);
        },
        resetData() {
            this.$data.form = this.$options.data().form;
        },
        beforeUpload(file) {
            return new Promise((resolve, rej) => {
                this.uploading = true;
                // 文件类型限制
                let FileExt = file.name.replace(/.+\./, '');
                let acceptList = this.accept.split(',');
                acceptList = acceptList.filter(item => !!item).map(item => item.replace('.', '').trim().toLowerCase());
                if (acceptList.length > 0 && acceptList.indexOf(FileExt.toLowerCase()) === -1) {
                    this.$message({
                        type: 'warning',
                        message: `请上传后缀名为${this.accept}的附件！`,
                    });
                    this.uploading = false;
                    rej(false);
                }
                // 大小限制
                const isLtLimitSize = file.size / 1024 / 1024 < this.size;
                if (!isLtLimitSize) {
                    this.$message.error(`上传文件大小不能超过 ${this.size}MB!`);
                    this.uploading = false;
                    rej(false);
                }
                file.text().then(fileText => {
                    for (let i = 0; i < this.form.fileList.length; i++) {
                        const file1 = this.form.fileList[i];
                        file1.raw.text().then(fileT => {
                            if (fileText === fileT && file.name === file1.name) {
                                this.$message.error(`文件${file.name}已存在`);
                                this.uploading = false;
                                rej(false);
                            }
                            // when loop to last one, should add file as normal
                            if (i === this.form.fileList.length - 1) {
                                this.uploading = false;
                                this.__loadHeaders();
                                resolve(true);
                            }
                        });
                    }
                    if (this.form.fileList.length === 0) {
                        this.uploading = false;
                        this.__loadHeaders();
                        resolve(true);
                    }
                });
            });
        },
        handleSuccess(res, _, fileList) {
            this.uploading = false;
            this.form.fileList = fileList;
            if (res.code !== '000000') {
                // depends on the data responsed by BE
                this.$message.error(res.msg || res.message || res.error);
                this.resetData();
            } else {
                this.$emit('uploadSucceeded', res.data || res);
            }
        },
        handleFileChange(file, fileList) {
            if (!this.__autoUpload) {
                this.form.fileList = fileList;
            }
        },
        onError(err) {
            this.uploading = false;
            this.$message.error('上传失败，请稍后重试');
            this.$emit('uploadFailed', err);
        },
    },
};
</script>
