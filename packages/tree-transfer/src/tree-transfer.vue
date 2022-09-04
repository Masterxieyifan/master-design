<template>
    <section class="tree-transfer">
        <article class="left">
            <header>
                <el-checkbox ref="checkbox" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{leftHeadLeft}}</el-checkbox>
                <span class="number">{{checkedDataList.length}}/{{total}}</span>
            </header>
            <section>
                <el-input
                    :placeholder="leftPlaceholder"
                    size="small"
                    clearable
                    v-model="filterTextLeft">
                </el-input>
                <div class="left-selected-box">
                    <MdEmpty v-show="data.length === 0 || (filterTextLeft!=='' && !leftHasSearched) " class="tree-transfer-no-data"></MdEmpty>
                    <el-tree
                        :data="data"
                        :show-checkbox="true"
                        node-key="id"
                        ref="tree"
                        empty-text=""
                        :expand-on-click-node="false"
                        :check-strictly="false"
                        check-on-click-node
                        default-expand-all
                        :default-checked-keys="defaultCheckedKeys"
                        :filter-node-method="filterNode"
                        @check="handleCheckChange"
                        :props="props"
                        v-show="data.length > 0">
                        <span class="transfer-tree-node" slot-scope="{ node }">
                            <el-tooltip
                                class="item"
                                effect="dark"
                                :open-delay="400"
                                :content="node.label"
                                :disabled="isDisableTooltip"
                                placement="top-start">
                                <span class="transfer-tree-node-label" :ref="node.key" @mouseover="onMouseOver(node.key)">{{ node.label }}</span>
                            </el-tooltip>
                        </span>
                    </el-tree>
                </div>
            </section>
        </article>
        <article class="right">
            <header>
                <span class="title">{{rightHeadLeft}}</span>
                <el-button
                    type="text"
                    icon="el-icon-delete"
                    @click="handleRemoveAll"
                    :disabled="checkedDataList.length === 0">{{rightHeadRight}}</el-button>
            </header>
            <section>
                <el-input
                    :placeholder="rightPlaceholder"
                    size="small"
                    clearable
                    v-model="filterTextRight">
                </el-input>
                <div class="selected-box el-checkbox-group">
                    <md-empty v-show="checkedDataList.length === 0 || (filterTextRight!=='' && !rightHasSearched)" class="tree-transfer-no-data"></md-empty>
                    <template v-for="item in checkedDataList">
                        <p class="selected-box-list"  :key="item[props.key]" :class="{'is-hidden' : filterTextRight!=='' && !item.searched}">
                            <el-tooltip
                                class="item"
                                effect="dark"
                                :open-delay="400"
                                :content="item[props.label]"
                                :disabled="isDisableTooltip"
                                placement="top-start">
                                <span class="transfer-tree-node-right-label" :ref="'right' + item[props.key]" @mouseover="onMouseOverRight('right' + item[props.key])">{{item[props.label]}}</span>
                            </el-tooltip>
                            <i class="el-icon-circle-close" @click="handleClose(item)"></i>
                        </p>
                    </template>
                </div>
            </section>
        </article>
    </section>
</template>
<script>
import MdEmpty from '../../empty';
export default {
    name: 'MdTreeTransfer',
    components: {
        MdEmpty,
    },
    model: {
        prop: 'value',
        event: 'node-change',
    },
    props: {
        value: {
            type: Array,
            default: () => ([]),
        },
        data: {
            type: Array,
            default: () => ([]),
        },
        props: {
            type: Object,
            default: () => ({
                key: 'id',
                label: 'label',
                children: 'children',
            }),
        },
        leftPlaceholder: {
            type: String,
            default: '请输入关键字',
        },
        rightPlaceholder: {
            type: String,
            default: '请输入关键字',
        },
        leftHeadLeft: {
            type: String,
            default: '未选',
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
    computed: {
        total() {
            let leaf = 0;
            let that = this;
            function getLeaf(data) {
                data.forEach(item => {
                    if (item[that.props.children] && item[that.props.children].length > 0) {
                        getLeaf (item[that.props.children]);
                    } else {
                        leaf++;
                        that.flatData[item[that.props.key]] = item;
                    }
                });
            }
            getLeaf(this.data);
            return leaf || 0;
        },
        isIndeterminate() {
            const checkedLength = this.checkedDataList.length;
            return checkedLength > 0 && checkedLength < this.total;
        },
        checkAll: {
            get() {
                const checkedLength = this.checkedDataList.length;
                return checkedLength > 0 && checkedLength === this.total;
            },
            set(val) {
                return val;
            }
        },
    },
    watch: {
        filterTextLeft(val) {
            this.leftHasSearched = false;
            this.$refs.tree.filter(val);
        },
        filterTextRight(val) {
            this.rightHasSearched = false;
            this.checkedDataList.forEach(item => {
                if (item[this.props.label].toLowerCase().indexOf(val.toLowerCase()) !== -1) {
                    item.searched = true;
                    this.rightHasSearched = true;
                } else {
                    item.searched = false;
                }
            });
        },
        value: {
            handler(val) {
                this.defaultCheckedKeys = val;
                this.setCheckList();
            },
            deep: true,
            immediate: true,
        },
        total: {
            handler() {
                this.setCheckList();
            },
            deep: true,
            immediate: true,
        },
    },
    data() {
        return {
            filterTextLeft: '',
            filterTextRight: '',
            checkedDataList: [],
            defaultCheckedKeys: [],
            leftHasSearched: false,
            rightHasSearched: false,
            flatData: {},
            isDisableTooltip: true,
        };
    },
    methods: {
        // 设置勾选
        setCheckList() {
            this.checkedDataList = [];
            if (Object.keys(this.flatData).length > 0) {
                this.defaultCheckedKeys = this.value;
                this.value.forEach(item =>{
                    if (this.flatData[item]) {
                        this.checkedDataList.push(this.flatData[item]);
                    }
                });
                this.$nextTick(() => {
                    this.$refs.tree.setCheckedKeys(this.value, false);
                });
            }
        },
        // 判读是否开启tooltip
        onMouseOver(str) {
            const parentWidth = this.$refs[str].parentNode.offsetWidth;
            const contentWidth = this.$refs[str].clientWidth;
            this.isDisableTooltip = contentWidth === parentWidth ? false : true;
        },
        // 判断右侧是否开启tooltip
        onMouseOverRight(str) {
            const rightParentWidth = this.$refs[str][0].parentNode.offsetWidth;
            const rightContentWidth = this.$refs[str][0].clientWidth + 30;
            this.isDisableTooltip = rightContentWidth === rightParentWidth ? false : true;
        },
        //过滤树
        filterNode(value, data) {
            if (!value) return true;
            if (data[this.props.label].toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                this.leftHasSearched = true;
                return true;
            }
            return false;
        },
        //复选框触发事件
        handleCheckChange() {
            this.$nextTick(()=>{
                this.checkedDataList = this.$refs.tree.getCheckedNodes(true, true);
                this.$emit('node-change', this.$refs.tree.getCheckedKeys(true));
            });
        },
        //全选 || 取消全选
        handleCheckAllChange(val) {
            if (val){
                this.$refs.tree.setCheckedKeys(Object.keys(this.flatData));
            } else {
                this.$refs.tree.setCheckedNodes([]);
            }
            this.handleCheckChange();
        },
        handleRemoveAll() {
            this.$confirm(this.removeAllPrompt, this.removeAllTitle, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                cancelButtonClass: 'is-plain',
                type: 'warning',
            }).then(() => {
                this.$message.success('移除成功');
                this.checkedDataList = [];
                this.defaultCheckedKeys = [];
                this.$emit('node-change', []);
                this.handleCheckAllChange(false);
            }).catch(err => {
                this.$emit('cancel', err);
            });
        },
        //删除已选
        handleClose(item) {
            this.$refs.tree.setChecked( item, false);
            let index = this.checkedDataList.findIndex(el => el.id === item.id);
            if (index !== -1) {
                this.checkedDataList.splice(index, 1);
                this.$emit('node-change', this.$refs.tree.getCheckedKeys(true));
            }
        },
        getSelectedNodes() {
            return this.checkedDataList;
        },
    },
};
</script>