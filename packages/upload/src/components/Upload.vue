<template>
    <!-- 上传组件 -->
    <div class="vantop--upload-upload-wrapper" v-loading="loading">
        <el-upload
            :file-list="fileList"
            :auto-upload="autoUpload"
            :on-change="change"
            :on-remove="remove"
            :list-type="listType"
            :show-file-list="showFileList"
            :drag="drag"
            :multiple="multiple"
            :action="action"
            :headers="headers"
            :data="data"
            :name="name"
            :before-upload="beforeUpload"
            :on-success="success"
            :on-error="error"
            :with-credentials="withCredentials"
            :on-download="handleDownLoad"
            v-bind="Admin.$attrs"
            v-on="Admin.$listeners"
            class="el-upload"
        >
            <slot>
                <div class="el-upload__text">
                    <div class="text-head">
                        <i class="el-icon-upload"></i>
                        <span>将文件拖到此处，或<em>点击上传</em></span>
                    </div>
                    <div class="text-footer">
                        支持xlsx文件 ，文件不得大于2M，数据最多{{ eachLimit }}条
                    </div>
                </div>
            </slot>
        </el-upload>
    </div>
</template>

<script>
export default {
    name: 'Upload',
    inject: ['Admin'],
    props: {
        drag: {
            type: Boolean,
            default: false
        },
        multiple: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        fileList() {
            return this.Admin.fileList;
        },
        name() {
            return this.Admin.name;
        },
        action() {
            return this.Admin.action;
        },
        headers() {
            return this.Admin.headers;
        },
        data() {
            return {
                tenantId: this.Admin.tenantId
            };
        },
        withCredentials() {
            return this.Admin.withCredentials;
        },
        showFileList() {
            return this.Admin.showFileList;
        },
        listType() {
            return this.Admin.listType;
        },
        autoUpload() {
            return this.Admin.autoUpload;
        },
        loading() {
            return this.Admin.loading;
        },
        eachLimit() {
            return this.Admin.eachLimit;
        },
        suffixList() {
            return this.Admin.suffixList;
        },
        fileSize() {
            return this.Admin.fileSize;
        }
    },
    methods: {
        change(file, fileList) {
            this.Admin.fileList = fileList;
        },
        remove(file, fileList) {
            this.Admin.fileList = fileList;
        },
        beforeUpload(file) {
            const suffix = '.' + file.name?.split('.')[1];
            const fileType = this.suffixList?.includes(suffix);
            const fileSize = file.size / 1024 / 1024 < this.fileSize;

            if (!fileType) {
                this.$message.error('请检查上传文件类型!');
                return false;
            }
            if (!fileSize) {
                this.$message.error(`上传文件大小不能超过 ${fileSize}MB!`);
                return false;
            }
            return fileType && fileSize;
        },
        success(success) {
            this.Admin.success(success);
        },
        error(error) {
            this.Admin.error(error);
        },
        handleDownLoad(file) {
            const fileId = file.fileId || file.response.data[0].fileId;
            this.Admin.download(fileId);
        }
    }
};
</script>
