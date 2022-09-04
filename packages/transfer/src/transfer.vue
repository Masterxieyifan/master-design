<template>
    <section class="van-transfer">
        <article class="left">
            <header>
                <el-checkbox ref="checkbox" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">联系人</el-checkbox>
                <span class="number">{{checkedDataList.length}}/{{oldData.length}}</span>
            </header>
            <section>
                <el-input
                    :placeholder="leftPlaceholder"
                    size="small"
                    clearable
                    v-model="filterTextLeft">
                </el-input>
                <el-checkbox-group v-model="checkedDataList" @change="handleCheckedAddressChange">
                    <md-empty v-show="!data.length"></md-empty>
                    <el-checkbox v-for="item in transferData" :label="item[props.key]" :value-key="item[props.key]" :key="item[props.key]">{{item[props.label]}}</el-checkbox>
                </el-checkbox-group>
            </section>
        </article>
        <article class="right">
            <header>
                <span class="title">{{rightHeadLeft}}</span>
                <el-button
                    type="text"
                    icon="el-icon-delete"
                    @click="handleRemoveAll"
                    :disabled="selectedData.length === 0">{{rightHeadRight}}</el-button>
            </header>
            <section>
                <el-input
                    :placeholder="rightPlaceholder"
                    size="small"
                    clearable
                    v-model="filterTextRight">
                </el-input>
                <div class="selected-mail el-checkbox-group">
                    <md-empty v-show="!selectedData.length"></md-empty>
                    <p class="selected-mail-list" v-for="item in selectedData" :key="item[props.key]" >
                        <span>{{item[props.label]}}</span>
                        <i class="el-icon-circle-close" @click="handleClose(item)"></i>
                    </p>
                </div>
            </section>
        </article>
    </section>
</template>
<script>
import MdEmpty from '../../empty';
export default {
    name: 'MdTransfer',
    components: {
        MdEmpty,
    },
    props: {
        data: {
            type: Array,
            default: () => ([]),
        },
        checkedData: {
            type: Array,
            default: () => ([]),
        },
        props: {
            type: Object,
            default: () => ({
                key: 'id',
                label: 'label',
            }),
        },
        leftPlaceholder: {
            type: String,
            default: '请输入关键字'
        },
        rightPlaceholder: {
            type: String,
            default: '请输入关键字'
        },
        rightHeadLeft: {
            type: String,
            default: '已选',
        },
        rightHeadRight: {
            type: String,
            default: '全部移除',
        },
        removeAllPrompt: {
            type: String,
            default: '是否确定移除所有选中数据？',
        },
        removeAllTitle: {
            type: String,
            default: '批量移除',
        },
        targetOrder: {
            type: String,
            default: 'original',
        },
    },
    data() {
        return {
            filterTextLeft: '',
            isIndeterminate: false,
            checkAll: false,
            filterTextRight: '',
            oldSelectedData: [],
            oldData: [],
            leftTimer: null,
            rightTimer: null,
            tempObj: [],
            checkedDataList: [],
            transferData: [],
        };
    },
    computed: {
        selectedData: {
            set: function(newValue) {
                let tempData = this.filterTextLeft ? this.oldData : this.transferData;
                // 非全选，清空，过滤时全选
                if (!this.checkAll || newValue || this.filterTextLeft) {
                    this.tempObj = [];
                    if (this.targetOrder === 'original') {
                        for (let i=0;i<tempData.length;i++) {
                            for (let j=0;j<newValue.length;j++) {
                                if (newValue[j] === tempData[i][this.props.key]) {
                                    this.tempObj.push(tempData[i]);
                                    break;
                                }
                            }
                        }
                    } else {
                        for (let j=0;j<newValue.length;j++) {
                            for (let i=0;i<tempData.length;i++) {
                                if (newValue[j] === tempData[i][this.props.key]) {
                                    this.tempObj.push(tempData[i]);
                                    break;
                                }
                            }
                        }
                    }
                    this.$emit('change', this.tempObj);
                    return;
                }
                this.tempObj = tempData;
                this.$emit('change', this.tempObj);
            },
            get: function() {
                return this.tempObj;
            },
        },
    },
    watch: {
        filterTextLeft: function(val) {
            if (this.leftTimer) clearTimeout(this.leftTimer);
            if (val) {
                this.leftTimer = setTimeout(() => {
                    this.transferData = this.oldData.filter(item => item[this.props.label].indexOf(val) !== -1 && item);
                }, 200);
            } else {
                this.transferData = this.oldData;
                if (this.selectedData.length) this.isIndeterminate = true;
            }
        },
        filterTextRight: function(val) {
            if (this.rightTimer) clearTimeout(this.rightTimer);
            if (val) {
                this.rightTimer = setTimeout(() => {
                    let obj = [];
                    this.oldSelectedData.forEach(item => {
                        if (item[this.props.label].indexOf(val) !== -1) {
                            obj.push(item[this.props.key]);
                        }
                    });
                    this.selectedData = obj;
                }, 200);
            } else {
                this.selectedData = this.oldSelectedData.map(item => item[this.props.key]);
            }
        },
    },
    mounted() {
        let checkedMapData = this.checkedData.map(item => item[this.props.key]);
        this.oldData = this.data;
        this.transferData = this.data;
        this.selectedData = checkedMapData;
        this.oldSelectedData = this.checkedData;
        this.checkedDataList = checkedMapData;
        if (this.selectedData.length < this.data.length) {
            this.isIndeterminate = true;
        } else if (this.selectedData.length === this.data.length) {
            this.checkAll = true;
            this.isIndeterminate = false;
        }
    },
    methods: {
        handleCheckAllChange(val) {
            if (this.filterTextLeft) {
                if (val) {
                    let obj = this.transferData.map(item => item[this.props.key]);
                    let temp = [...new Set([...obj, ...this.selectedData.map(item => item[this.props.key])])];
                    this.selectedData = temp;
                    this.checkedDataList = [...new Set([...this.checkedDataList, ...obj])];
                } else {
                    for (let  i=0;i<this.transferData.length;i++) {
                        for (let j=0;j<this.oldData.length; j++) {
                            if (this.transferData[i][this.props.key] === this.oldData[j][this.props.key]) {
                                this.checkedDataList.splice(this.checkedDataList.indexOf(this.transferData[i][this.props.key]), 1);
                            }
                        }
                    }
                    this.selectedData = this.checkedDataList;
                }
                this.oldSelectedData = this.selectedData;
                this.isIndeterminate = false;
            } else {
                let mapData = this.transferData.map(item => item[this.props.key]);
                this.selectedData = val ? mapData : [];
                this.oldSelectedData = this.selectedData;
                this.checkedDataList = val ? mapData : [];
                this.isIndeterminate = false;
            }
        },
        handleCheckedAddressChange(value) {
            if (this.targetOrder === 'unshift' && this.oldSelectedData.length < value.length) {
                value.unshift(value.pop());
            }
            let checkedCount = value.length;
            this.selectedData = value;
            this.oldSelectedData = this.selectedData;
            this.checkAll = checkedCount === this.transferData.length;
            if (!this.filterTextLeft) {
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.transferData.length;
            }
        },
        handleRemoveAll() {
            this.$confirm(this.removeAllPrompt, this.removeAllTitle, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                cancelButtonClass: 'is-plain',
                type: 'warning',
            }).then(() => {
                this.$message.success('移除成功');
                this.isIndeterminate = false;
                this.selectedData = [];
                this.oldSelectedData = [];
                this.checkedDataList = [];
                this.checkAll = false;
            }).catch(err => {
                this.$emit('cancel', err);
            });
        },
        handleClose(item) {
            if (this.filterTextRight && this.selectedData.length >= 1) {
                let _selectData = this.selectedData, index=0, _index=0;
                _index = _selectData.findIndex(el => el[this.props.key] === item[this.props.key]);
                index = this.checkedDataList.findIndex(el => el === item[this.props.key]);
                _selectData.splice(_index, 1);
                this.checkedDataList.splice(index, 1);
                this.oldSelectedData.splice(index, 1);
                this.selectedData = _selectData.map(item => item.id);
            } else {
                let index = this.checkedDataList.findIndex(el => el === item[this.props.key]);
                this.checkedDataList.splice(index, 1);
                this.selectedData = this.checkedDataList;
                this.oldSelectedData = this.selectedData;
                if (!this.checkedDataList.length){
                    this.isIndeterminate = false;
                    this.checkAll = false;
                }
                this.isIndeterminate = true;
            }
        },
    },
};
</script>
