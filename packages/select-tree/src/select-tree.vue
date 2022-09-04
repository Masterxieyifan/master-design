<template>
    <el-select
        v-model="selectShow"
        :size="size"
        :multiple="multiple"
        :collapse-tags="collapseTags"
        :label="label"
        :value-key="nodeKey"
        @change="selectChange"
        @remove-tag="removeTag"
        :closable="!__hasConfirm"
        :filterable="false"
        ref="selectTree"
        :disabled="disabled"
        :popper-class="__popoerClass"
        @visible-change="visibleChange"
        :class="[
            'width-200',
            isQuery ? 'is-query' : ''
        ]"
        :clearable="clearable"
        :option-width="setOptionWidth"
        :placeholder="placeholder"
    >
        <div class="select-tree-input-search" >
            <el-input
                type="text"
                ref="searchInput"
                placeholder="搜索"
                clearable
                borderless
                size="mini"
                v-model="filterText"
                prefixIcon="md-icon-search-16"
            />
        </div>
        <slot slot="empty" name="empty" />
        <el-option
            :value="selectedValue"
            v-loading="loadingTree"
            disabled
        >
            <el-tree
                v-bind="$attrs"
                v-on="$listeners"
                :data="treeData"
                :show-checkbox="multiple"
                :node-key="nodeKey"
                ref="tree"
                :expand-on-click-node="expandOnClickNode"
                :check-strictly="checkStrictly"
                :filter-strictly="filterStrictly"
                :highlight-current="!multiple"
                check-on-click-node
                :props="selectTreeProps"
                :default-checked-keys="defaultCheckedKeys"
                :filter-node-method="filterNode"
                @check="nodeCheckChange"
                @node-click="nodeClickChange"
                :class="{
                    'vantop-select-tree': true,
                    'select-tree-multiple': multiple,
                }"
                :default-expand-all="defaultExpandAll"
                v-loading="loadingTree"
            >
                <span class="select-tree-node" slot-scope="{ node }">
                    <el-tooltip
                        class="item"
                        effect="dark"
                        :open-delay="400"
                        :content="node.label"
                        :disabled="isDisableTooltip"
                        placement="top-start"
                    >
                        <span class="select-tree-node-label" :ref="node.id" @mouseover="onMouseOver(node.id)">{{ node.label }}</span>
                    </el-tooltip>
                </span>
            </el-tree>
        </el-option>
        <div
            class="slect-tree--button__group"
            v-if="__hasConfirm"
        >
            <el-button
                size="mini"
                type="info"
                @click="$refs.selectTree.blur()"
            >取 消</el-button>
            <el-button
                size="mini"
                type="primary"
                @click="handleConfirm"
            >确 定</el-button>
        </div>
    </el-select>
</template>

<script>
import emitter from 'element-ui/src/mixins/emitter';
import { isEmpty } from '@master_vantop/vantop-util';

export default {
    name: 'MdSelectTree',
    componentName: 'SelectTree',
    mixins: [emitter],
    props: {
        nodeKey: {
            type: String,
            default: 'id'
        },
        hasConfirm: {
            type: Boolean,
            default: null
        },
        label: String,
        prop: String,
        placeholder: {
            type: String,
            default: '请选择',
        },
        value: {
            type: [Array, String, Number],
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        clearable: {
            type: Boolean,
            default: false,
        },
        selectTreeProps: { //配置选项
            type: Object,
            default: () => ({
                disabled: 'disabled', // 指定节点选择框是否禁用为节点对象的某个属性值
                isLeaf: 'isLeaf', // 指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效
                label: 'label', // 指定节点标签为节点对象的某个属性值
                children: 'children', // 指定子树为节点对象的某个属性值
            }),
        },
        treeData: { //树数据
            type: Array,
            default: () => ([]),
        },
        multiple: { //是否多选，默认多选
            type: Boolean,
            default: true,
        },
        checkStrictly: { //在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false（父子级联）
            type: Boolean,
            default:false,
        },
        filterStrictly: {
            type: Boolean,
            default: true,
        },
        singleLeafSelect: { //单选模式下，是否只让选择叶子节点,为false，则表示所有节点都可选择，为true则表示只能选择叶子节点
            type: Boolean,
            default:false,
        },
        singleLeafWarning: {
            type: Boolean,
            default: false,
        },
        defaultExpandAll: { //是否展开所有树节点
            type: Boolean,
            default:true,
        },
        checkLoading: { //多选模式下，勾选节点时是否loading状态
            type: Boolean,
            default:false,
        },
        setOptionWidth: [Number, String], //设置下拉面板宽度
        size: {
            type: String,
            default: '',
        },
        'collapse-tags': { //
            type: Boolean,
            default: true,
        },
        popperClass: {
            type: String,
            default: '',
        }
    },
    computed: {
        expandOnClickNode() {
            return !this.multiple && this.singleLeafSelect;
        },
        flatData() { //扁平化处理数据结构
            const res = {};
            if (this.treeData && this.treeData.length > 0) {
                const fn = source => {
                    source.forEach(el => {
                        res[el[this.nodeKey]] = el;
                        el[this.selectTreeProps.children] && el[this.selectTreeProps.children].length > 0 ? fn(el[this.selectTreeProps.children]) : '';
                    });
                };
                fn(this.treeData);
            }
            return res;
        },
        __hasConfirm() {
            return this.hasConfirm === false
                ? false
                : (this.hasConfirm || this.prop) && this.multiple;
        },
        __popoerClass() {
            return `vantop-select-tree-wrapper ${this.popperClass}`;
        }
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        },
        value: {
            handler(val) {
                this.defaultCheckedKeys = this.multiple ? val : [val];
                this.setSelect();
            },
            deep: true,
            immediate: true,
        },
        flatData: {
            handler() {
                this.setSelect();
            },
            deep: true,
            immediate: true,
        },
    },
    data() {
        return {
            isQuery: false,
            selectShow: this.multiple ? [] : '',
            selectedValue: this.multiple ? [] : '',
            filterText: '',
            labelProp: this.selectTreeProps.label ? this.selectTreeProps.label : 'label',
            defaultCheckedKeys: [],
            treeNode:null,
            optionsWidth: 200,
            loadingTree: false,
            isDisableTooltip: true,
            confirming: null,
        };
    },
    mounted() {
        this.init(this.treeData);
    },
    methods: {
        //初始化
        init() {
            this.defaultCheckedKeys = this.multiple ? this.value : [this.value];
            this.initScroll();
        },
        // 初始化滚动条
        initScroll() {
            this.$nextTick(()=>{
                const scrollWrap = document.querySelectorAll('.vantop-select-tree-wrapper .el-scrollbar .el-select-dropdown__wrap');
                const scrollBar = document.querySelectorAll('.vantop-select-tree-wrapper .el-scrollbar .el-scrollbar__bar');
                scrollWrap.forEach(ele => ele.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;');
                scrollBar.forEach(ele => ele.style.width = 0);
            });
        },
        //设置默认值
        setSelect() {
            if (Object.keys(this.flatData).length > 0) {
                if (this.multiple) {
                    this.setMultiple(this.flatData);
                } else {
                    this.setSingle(this.flatData);
                }
            } else if (isEmpty(this.value)) {
                this.selectShow = this.multiple ? [] : '';
                this.selectedValue = this.multiple ? [] : '';
            }
        },
        //多选
        setMultiple(res) {
            this.selectShow = [];
            this.selectedValue = [];
            if (this.value && this.value.length > 0){
                this.value.forEach(el => {
                    if (res[el]){
                        this.selectShow.push(res[el][this.labelProp]);
                        this.selectedValue.push(res[el]);
                    }
                });
                this.$nextTick(() => {
                    this.$refs.tree.setCheckedKeys(this.defaultCheckedKeys, this.checkStrictly);
                });
            } else {
                this.clearSelected();
            }
        },
        //单选
        setSingle(res) {
            this.selectShow = '';
            this.selectedValue = '';
            if (this.value !== ''){
                const el = this.value;
                if (res[el]) {
                    this.selectShow = res[el][this.labelProp];
                    this.selectedValue = res[el];
                    this.treeNode = res[el];
                    this.$nextTick(()=>{
                        this.$refs.tree.setCurrentNode(res[el]);
                    });
                }
            } else {
                this.clearSelectNode();
            }
        },
        // 判读是否开启tooltip
        onMouseOver(str) {
            const parentWidth = this.$refs[str].parentNode.offsetWidth;
            const contentWidth = this.$refs[str].clientWidth;
            this.isDisableTooltip = contentWidth === parentWidth ? false : true;
        },
        //过滤树
        filterNode(value, data) {
            if (!value) return true;
            return data[this.labelProp] && data[this.labelProp].toLowerCase().indexOf(value.toLowerCase()) !== -1;
        },
        //select框值改变时候触发的事件
        selectChange(e) {
            if (this.multiple) {
                if (e && e.length === 0) {
                    this.$emit('input', []);
                    this.$emit('handleCheckChange', [], null, null);
                    this.dispatchOperate(this.prop, []);
                }
            } else {
                const value = Array.isArray(this.value) ? [] : '';
                this.$emit('input', value);
                this.$emit('handleCheckChange', value, null, null);
                this.dispatchOperate(this.prop, value);
            }
        },
        // 多选时清除选项
        removeTag(tag){
            let node = this.selectedValue.find(item => item[this.labelProp] === tag);
            this.$refs.tree.setChecked(node, false);//设置勾选的值
            const value = this.$refs.tree.getCheckedKeys(!this.checkStrictly);
            this.$emit('input', value);
            this.$emit('handleCheckChange', this.$refs.tree.getCheckedNodes(!this.checkStrictly, !this.checkStrictly), node, false);
            this.dispatchOperate(this.prop, value);
        },
        //复选框触发事件
        nodeCheckChange(currentData) {
            if (this.multiple){
                if (this.__hasConfirm && !this.confirming) return;
                if (this.checkLoading) this.loadingTree = true;
                const res = this.$refs.tree.getCheckedNodes(!this.checkStrictly, !this.checkStrictly);
                this.selectShow = res.map(item => item[this.labelProp]);
                this.selectedValue = res;
                const value = this.$refs.tree.getCheckedKeys(!this.checkStrictly);
                this.$emit('input', value);
                !this.confirming && this.$emit('handleCheckChange', res, currentData, this.$refs.tree.getNode(currentData).checked);
                this.dispatchOperate(this.prop, value);
                setTimeout(()=>{this.loadingTree = false;}, 500);
                this.confirming = false;
            }
        },
        //节点点击触发事件
        nodeClickChange(data, node) {
            if (this.multiple){ //多选时，非选中状态，清空状态
                if (node && !node.checked) {
                    this.clearSelectNode();
                }
            } else {
                if (this.singleLeafSelect){
                    if (data[this.selectTreeProps.children] && data[this.selectTreeProps.children].length > 0){
                        if (this.singleLeafWarning) {
                            this.$message({
                                type: 'warning',
                                message: `不能选择${data[this.labelProp]}`,
                            });
                        }
                        if (this.treeNode){
                            this.$nextTick(()=>{
                                this.$refs.tree.setCurrentNode(this.treeNode);
                            });
                        } else {
                            this.clearSelectNode();
                        }
                        return;
                    }
                }

                const arrLabel = Array.isArray(this.value) ? [data[this.labelProp]] : data[this.labelProp];
                const arr = Array.isArray(this.value) ? [data[this.nodeKey]] : data[this.nodeKey];
                this.selectedValue = arr;
                this.selectShow = arrLabel;
                this.$emit('input', arr);
                this.$emit('handleCheckChange', data, null, null);
                this.dispatchOperate(this.prop, arr);
                this.$refs.selectTree.blur();
            }
        },
        visibleChange(flag){
            this.$emit('visible-change', flag);
            if (flag) this.$nextTick(this.$refs.searchInput.focus);
            if (!flag && this.__hasConfirm) {
                this.setSelect();
            }
        },
        clearSelected() {
            this.$refs.tree && this.$refs.tree.setCheckedNodes([]); //多选时清空所选
        },
        clearSelectNode() {
            this.$refs.tree && this.$refs.tree.setCurrentKey(null); //单选时清空所选
        },
        reset() {
            this.selectShow = Array.isArray(this.value) ? [] : '';
            this.selectedValue = Array.isArray(this.value) ? [] : '';
            this.filterText = '';
            this.labelProp = this.selectTreeProps.label ? this.selectTreeProps.label : 'label';
            this.defaultCheckedKeys = [];
            this.treeNode = null;
            this.optionsWidth = 200;
            this.loadingTree = false;
            this.isDisableTooltip = true;
            this.multiple ? this.clearSelected() : this.clearSelectNode();
            const value = Array.isArray(this.value) ? [] : '';
            this.$emit('input', value);
            this.$emit('handleCheckChange', value, null, null);
            this.dispatchOperate(this.prop, value);
        },
        handleConfirm() {
            if (!this.multiple) return;
            this.confirming = true;
            this.nodeCheckChange();
            this.$refs.selectTree.blur();
        },
    },
};
</script>