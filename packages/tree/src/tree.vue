<template>
    <div class="van-tree" :style="computedStyle">
        <div class="search-input--wrapper" v-if="search">
            <input
                type="text"
                :placeholder="placeHodlerText"
                v-model="filterText"
            />
        </div>
        <div class="tree-wrapper">
            <template v-if="data && data.length > 0">
                <el-scrollbar :style="listWrapperStyle" ref="scrollBar">
                    <el-tree
                        class="filter-tree"
                        v-bind="$attrs"
                        v-on="$listeners"
                        :data="data"
                        :filter-node-method="filterNode"
                        node-key="id"
                        :indent="12"
                        :props="treeProps"
                        :default-expand-all="defaultExpandAll"
                        :expand-on-click-node="false"
                        @node-drag-start="handleDragStart"
                        @node-drop="handleDrop"
                        :allow-drop="allowDrop"
                        ref="tree"
                    >
                        <span
                            class="custom-tree-node"
                            slot-scope="{ node, data }"
                            :class="{ active: node.active }"
                            @mouseover="selectStyle(node)"
                            @mouseout="outStyle(node)"
                        >
                            <el-tooltip
                                class="item"
                                effect="dark"
                                :open-delay="700"
                                placement="top-start"
                            >
                                <div class="title" slot="content">
                                    <slot name="vanContent" :data="data">
                                        {{data[treeProps.count] ? `${node.label} (${data[treeProps.count]})` : node.label}}
                                    </slot>
                                </div>
                                <div class="van-tree-popover" :style="{maxWidth:(node.maxWidth ? node.maxWidth : width - node.level * 16) + 'px', }">
                                    <slot class="van-tree-node-label-count" name="vanTooltip" :data="data">
                                        <span>{{ node.label }}</span>
                                        <span class="van-tree-node-label-count" v-if="data[treeProps.count]">{{` (${data[treeProps.count]})`}}</span>
                                    </slot>
                                </div>
                            </el-tooltip>
                            <span v-show="node.active" class="custom-tree-node-opt">
                                <span @click.stop="append(data, node)" class="custom-tree-node-text">
                                    <slot name="append" :data="data"></slot>
                                </span>
                                <span @click.stop="modify(data)" class="custom-tree-node-text">
                                    <slot name="modify" :data="data"></slot>
                                </span>
                                <span @click.stop="remove(node, data)" class="custom-tree-node-text">
                                    <slot name="remove" :data="data"></slot>
                                </span>
                            </span>
                        </span>
                    </el-tree>
                </el-scrollbar>
            </template>
            <template v-if="data && data.length == 0">
                <el-link
                    type="primary"
                    :underline="false"
                    @click.stop="append()"
                    icon="el-icon-plus"
                    class="van-tree-append"
                    >{{ noRootTitle }}</el-link
                >
            </template>
        </div>
    </div>
</template>
<script>
export default {
    name: 'MdTree',
    props: {
        search: {
            type: Boolean,
            default: true,
        },
        placeHodlerText: {
            type: String,
            default: '搜索',
        },
        width: {
            type: Number,
            default: 200,
        },
        height: {
            type: Number,
            default: 500,
        },
        maxHeight: {
            type: Number,
            default: 500,
        },
        data: {
            type: Array,
            default: () => ([]),
        },
        noRootTitle: {
            type: String,
            default: '暂无节点数据',
        },
        defaultExpandAll: {
            type: Boolean,
            default: false,
        },
        treeProps: { //配置选项
            type: Object,
            default: () => ({
                label: 'label', // 指定节点标签为节点对象的某个属性值
                children: 'children', // 指定子树为节点对象的某个属性值
                count: '',
            }),
        },
        isInjectTree: {
            type: Boolean,
            default: true,
        },
        dropPlaceStrictly: {
            type: Boolean,
            default: false,
        },
        dropPlaceStrictlyFn: {
            type: Function,
        }
    },
    data() {
        return {
            filterText: '',
            dragStartNode: null,
            labelProp: this.treeProps.label ? this.treeProps.label : 'label',
        };
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        },
    },
    computed: {
        computedStyle() {
            return {
                width: `${this.width}px`,
                height: `${this.height}px`,
            };
        },
        listWrapperStyle() {
            return {
                height: `${this.height - 49}px`, // subtract the height of search bar
            };
        },
    },
    methods: {
        //过滤
        filterNode(value, data) {
            if (!value) return true;
            return data[this.labelProp].toLowerCase().indexOf(value.toLowerCase()) !== -1;
        },
        //新增
        append(data, node) {
            if (node && node.level === 5) {
                this.$message({
                    type: 'warning',
                    message: '注意，最多至5级节点！',
                });
                return;
            }
            if (this.isInjectTree){
                let newChild = null;
                if (data) {
                    let id = data.id;
                    let name = data[this.labelProp];
                    let length = data[this.treeProps.children] ? data[this.treeProps.children].length : 0;
                    newChild = {
                        id: `${id}-${length + 1}`,
                        [this.labelProp]: `${name}-${length + 1}`,
                        [this.treeProps.children]: [],
                        parentId: id,
                    };
                } else {
                    newChild = {
                        [this.labelProp]: '默认分组',
                        [this.treeProps.children]: [],
                    };
                }
                this.$emit('append', newChild);
            } else {
                this.$emit('append', data);
            }
        },
        //修改
        modify(data) {
            this.$emit('modify', data);
        },
        //删除
        remove(node, data) {
            this.$emit('remove', node, data);
        },
        getMaxFloor(treeData) {
            let max = 0;
            function each(data, floor) {
                data.forEach(e => {
                    e.floor = floor;
                    if (floor > max) {
                        max = floor;
                    }
                    if (e.childNodes && e.childNodes.length > 0) {
                        each(e.childNodes, floor + 1);
                    }
                });
            }
            each(treeData, 1);
            return max + 1;
        },
        //判断那个节点下不能放置
        allowDrop(draggingNode, dropNode, dropType) {
            if (this.dropPlaceStrictly) {
                return this.dropPlaceStrictlyFn(draggingNode, dropNode, dropType);
            }
            if (dropType === 'inner'){
                if (dropNode.level + this.getMaxFloor(draggingNode.childNodes) > 5){
                    return false;
                }
            } else {
                if (dropNode.parent.level + this.getMaxFloor(draggingNode.childNodes) > 5){
                    return false;
                }
            }
            return true;
        },
        //设置拖拽节点
        handleDragStart(node) {
            this.dragStartNode = node;
        },
        //拖拽结束
        handleDrop(draggingNode, dropNode, dropType) {
            this.$emit('drag', draggingNode, dropNode, dropType);
        },
        //进入样式
        selectStyle(item) {
            this.$nextTick(function() {
                this.$set(item, 'active', true);
                this.$set(item, 'maxWidth', this.width - item.level * 20 - 50);
            });
        },
        //出去样式
        outStyle(item) {
            this.$nextTick(function() {
                this.$set(item, 'active', false);
                this.$set(item, 'maxWidth', this.width - item.level * 16);
            });
        },
    },
};
</script>
