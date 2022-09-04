<template>
    <div
        :class="[
            'md-sidebar',
            `md-sidebar-${type}`,
            isMultiple ? 'is--checkbox': 'is--radio',
            {
                'is--border': border,
            }
        ]"
    >
        <div class="md-sidebar-header">
            <span
                class="md-sidebar--title"
                @mousemove="handleMouseEnter(title)"
                @mouseleave="handleMouseLeave"
            >{{title}}</span>
            <div class="md-sidebar-header--btns">
                <el-button
                    v-for="({icon, text, handler, disabled}, index) in moreBtnCalc(__headerBtns, false)"
                    :key="`${text}${index}`"
                    iconed
                    type="info"
                    size="mini"
                    :icon="icon"
                    :hint="text"
                    :disabled="disabled && disabled()"
                    @click="handleClick(handler)"
                />
                <el-dropdown
                    v-if="moreBtnCalc(__headerBtns, true).length > 0"
                    trigger="click"
                    @command="handleMoreBtn(__headerBtns, $event)"
                >
                    <el-button
                        iconed
                        type="info"
                        size="mini"
                        icon="md-icon-more-16"
                        hint="更多"
                    />
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                            v-for="({icon, text, disabled}, index) in moreBtnCalc(__headerBtns, true)"
                            :icon="icon"
                            :disabled="disabled && disabled()"
                            :key="`${text}${index}`"
                            :command="text"
                        >{{text}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <el-input
            class="md-sidebar-search"
            v-model="filterText"
            prefixIcon="md-icon-search-16"
            clearable
            :placeholder="placeholder"
        />
        <md-scrollbar
            class="md-sidebar-main--wrapper"
            v-show="data && data.length > 0"
            v-loading="loading"
        >
            <el-tree
                ref="tree"
                class="md-sidebar-main"
                v-bind="$attrs"
                v-on="$listeners"
                filter-strictly
                :data="data"
                :props="props"
                :key="treeKey"
                :nodeKey="nodeKey"
                :sidebarLine="sidebarLine"
                :showCheckbox="isMultiple"
                :checkStrictly="checkStrictly"
                :highlightCurrent="!isMultiple || highlightCurrent"
                :filterNodeMethod="filterNode"
                :checkOnClickNode="checkOnClickNode"
                :defaultExpandAll="__defaultExpandAll"
                :expandOnClickNode="expandOnClickNode"
                @check="nodeCheckChange"
                @node-click="nodeClickChange"
            >
                <div
                    :class="[
                        'md-sidebar--tree-item',
                        {'is--disabled': data[disabledField]}
                    ]"
                    slot-scope="{ node, data}"
                >
                    <span
                        class="md-sidebar--tree-label"
                        @mousemove="handleMouseEnter(null)"
                        @mouseleave="handleMouseLeave"
                    >
                        <slot :node="node" :data="data">{{ node.label }}</slot>
                    </span>
                    <span
                        v-if="data[countField]"
                        class="md-sidebar--tree-number">{{data[countField]}}</span>
                    <div
                        class="md-sidebar--main-btns"
                        @click="(event)=>event.stopPropagation()"
                    >
                        <el-button
                            v-for="({icon, text, handler, disabled}, index) in moreBtnCalc(operations, false, {node, data})"
                            :key="`${text}${index}`"
                            iconed
                            type="info"
                            size="mini"
                            :icon="icon"
                            :hint="text"
                            :disabled="disabled && disabled({data, node})"
                            @click="handler({node, data})"
                        />
                        <el-dropdown
                            v-if="moreBtnCalc(operations, true, {node, data}).length > 0"
                            trigger="click"
                            @command="handleMoreBtn(operations, $event, {node, data})"
                        >
                            <el-button
                                iconed
                                type="info"
                                size="mini"
                                icon="md-icon-more-16"
                                hint="更多"
                                @click.native.stop
                            />
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item
                                    v-for="({icon, text, disabled}, index) in moreBtnCalc(operations, true, {node, data})"
                                    :icon="icon"
                                    :disabled="disabled && disabled({data, node})"
                                    :key="`${text}${index}`"
                                    :command="text"
                                >{{text}}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </el-tree>
        </md-scrollbar>
        <div
            v-show="!data || (data && data.length <= 0)"
            v-loading="loading"
            class="md-sidebar-empty"
        >
            <slot name="empty"><md-empty/></slot>
        </div>
        <div
            class="md-sidebar-footer"
            v-if="footerOperations.length > 0"
            :style="{
                'justify-content': footerOperations.length === 1 ? 'center' : 'space-between',
            }"
        >
            <el-button
                v-for="({icon, text, handler, disabled}, index) in moreBtnCalc(footerOperations, false)"
                :key="`${text}${index}`"
                type="text"
                :icon="icon"
                :disabled="disabled && disabled()"
                @click="handleClick(handler)"
            >{{text}}</el-button>
            <el-dropdown
                v-if="moreBtnCalc(footerOperations, true).length > 0"
                trigger="click"
                @command="handleMoreBtn(footerOperations, $event)"
            >
                <el-button
                    type="text"
                    icon="md-icon-more-16"
                >更多操作</el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                        v-for="({icon, text, disabled}, index) in moreBtnCalc(footerOperations, true)"
                        :icon="icon"
                        :key="`${text}${index}`"
                        :disabled="disabled && disabled()"
                        :command="text"
                    >{{text}}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-divider
                v-if="footerOperations.length > 1"
                direction="vertical"
            />
        </div>
        <el-tooltip
            v-model="tooltipShow"
            ref="tooltip"
            effect="dark"
            placement="top"
            :manual="true"
            :content="tooltip"
            :open-delay="500"
        />
    </div>
</template>

<script>
/* eslint-disable vue/no-reserved-keys */
export default {
    name: 'MdSidebar',
    props: {
        border: {
            type: Boolean,
            default: false
        },
        // header
        title: {
            type: String,
            default: ''
        },
        headerOperations: {
            type: Array,
            default: () => []
        },
        refresh: {
            type: Boolean,
            default: true
        },
        fold: {
            type: Boolean,
            default: true
        },
        // search
        placeholder: {
            type: String,
            default: '搜索'
        },
        filterNodeMethod: Function,
        // main
        highlightCurrent: {
            type: Boolean,
            default: false
        },
        checkOnClickNode: {
            type: Boolean,
            default: true
        },
        defaultExpandAll: {
            type: Boolean,
            default: false
        },
        data: {
            type: Array,
            default: () => []
        },
        loading: {
            type: Boolean,
            default: false
        },
        selectionMode: {
            type: String,
            default: 'radio',
            validator: (value) => ['radio', 'checkbox'].indexOf(value) !== -1
        },
        type: {
            type: String,
            default: 'tree',
            validator: (value) => ['tree', 'list'].indexOf(value) !== -1
        },
        nodeKey: {
            type: String,
            default: 'id'
        },
        radioStrictly: {
            type: Boolean,
            default: false
        },
        props: { //配置选项
            type: Object,
            default: () => ({
                disabled: 'disabled',
                isLeaf: 'isLeaf',
                label: 'label',
                children: 'children',
                count: 'data'
            }),
        },
        operations: {
            type: Array,
            default: () => []
        },
        checkStrictly: {
            type: Boolean,
            default: false
        },
        //footer
        footerOperations: {
            type: Array,
            default: () => []
        },
    },
    data() {
        return {
            filterText: '',
            __defaultExpandAll: false,
            treeKey: Date.now(),
            tooltip: '',
            tooltipShow: false,
            treeNode: null,
        };
    },
    computed: {
        __headerBtns({ fold, refresh, headerOperations, data }) {
            const btns = [];
            if (refresh) {
                btns.push({
                    icon: 'md-icon-refresh-16',
                    text: '刷新',
                    handler: () => {
                        this.clearSelected();
                        this.$emit('change', null);
                        this.$emit('refresh');
                    }
                });
            }
            if (fold && this.isTree) {
                btns.push({
                    icon: this.__defaultExpandAll ? 'md-icon-fold-16' : 'md-icon-unfold-16',
                    text: this.__defaultExpandAll? '全部收起' : '全部展开',
                    handler: () => {
                        this.__defaultExpandAll = !this.__defaultExpandAll;
                        if (data && data.length > 0) this.treeKey = Date.now();
                    }
                });
            }
            return [
                ...btns,
                ...headerOperations
            ];
        },
        expandOnClickNode() {
            return !this.isMultiple && !this.radioStrictly;
        },
        sidebarLine() {
            return this.type === 'tree' && !this.isMultiple;
        },
        isMultiple() {
            return this.selectionMode === 'checkbox';
        },
        isTree() {
            return this.type === 'tree';
        },
        countField() {
            return this.props.count || 'data';
        },
        labelField() {
            return this.props.label || 'label';
        },
        disabledField() {
            return this.props.disabled || 'disabled';
        }
    },
    watch: {
        filterText(val) {
            this.$tree.filter(val);
        },
        data: {
            handler() {
                this.clearSelected();
            },
            deep: true
        },
        defaultExpandAll: {
            immediate: true,
            handler(val) {
                this.__defaultExpandAll = val;
            }
        },
    },
    mounted() {
        this.$tooltip = this.$refs.tooltip;
        this.$tree= this.$refs.tree;
    },
    methods: {
        filterNode(value, data) {
            if (this.filterNodeMethod) return this.filterNodeMethod(value, data);
            if (!value) return true;
            if (!data[this.labelField]) return false;
            return data[this.labelField].toLowerCase().indexOf(value.toLowerCase()) !== -1;
        },
        handleMouseEnter(text) {
            if (this.mouseTimer) return;
            const target = event.target;
            if (target && target.scrollWidth > target.clientWidth) {
                this.mouseTimer = setTimeout(() => {
                    this.tooltip = text || target.textContent;
                    this.$tooltip.referenceElm = target;
                    this.tooltipShow = true;
                    this.mouseTimer = null;
                }, 500);
            }
        },
        handleMouseLeave() {
            clearTimeout(this.mouseTimer);
            this.mouseTimer = null;
            this.tooltipShow = false;
            this.$tooltip.referenceElm = this.$tooltip.$el;
        },
        moreBtnCalc(btns, isRest, nodeData = {}) {
            const MAX_BTNS = 2;
            btns = btns.filter(({ validator })=>!validator || validator(nodeData));
            if (btns.length > MAX_BTNS) {
                if (isRest) {
                    return btns.slice(MAX_BTNS - 1);
                }
                return btns.slice(0, MAX_BTNS - 1);
            }
            if (isRest) return [];
            return btns;
        },
        handleMoreBtn(btns, command, nodeData) {
            const findOne = btns.find(item => item.text === command);
            const handler = findOne.handler;
            if (handler && typeof handler === 'function') {
                if (nodeData) {
                    handler(nodeData);
                } else {
                    this.handleClick(handler);
                }
            }
        },
        handleClick(handler) {
            const selected = this.getSelectKey();
            handler(selected, { data: this.data });
        },
        nodeClickChange(data) {
            if (!this.isMultiple){
                if (data[this.disabledField]) {
                    this.resetNodeClick();
                    return;
                }
                const key = data[this.nodeKey];
                if (!this.radioStrictly) {
                    const childrenField = this.props.children || 'children';
                    if (data[childrenField] && data[childrenField].length > 0){
                        this.resetNodeClick();
                    } else {
                        this.treeNode = key;
                        this.$emit('change', key);
                    }
                } else {
                    this.treeNode = key;
                    this.$emit('change', key);
                }
            }
        },
        resetNodeClick() {
            if (this.treeNode){
                this.$nextTick(()=>{
                    this.$tree.setCurrentKey(this.treeNode);
                });
            } else {
                this.$tree.setCurrentKey(null);
            }
        },
        nodeCheckChange() {
            if (this.isMultiple) {
                const data = this.$tree.getCheckedKeys(!this.checkStrictly);
                this.$emit('change', data);
            }
        },
        getSelectKey() {
            return this.isMultiple ? this.$tree.getCheckedKeys(!this.checkStrictly) : this.treeNode;
        },
        clearSelected() {
            this.$tree.setCheckedNodes([]);
            this.$tree.setCurrentKey(null);
        }
    },
};
</script>