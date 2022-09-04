<template>
    <div class="vantop-searchtree--wrapper" :style="computedStyle">
        <div class="search-input--wrapper" v-if="search">
            <input
                type="text"
                :placeholder="placeHodlerText"
                v-model="filterText"
            />
        </div>
        <div class="tree-wrapper">
            <el-tree
                class="filter-tree"
                v-bind="$attrs"
                v-on="$listeners"
                :filter-node-method="filterNode"
                ref="tree"
            >
                <span class="custom-tree-node tree-label" slot-scope="{ node }">
                    <el-tooltip
                        effect="dark"
                        :open-delay="300"
                        :content="node.label"
                        placement="top-start"
                    >
                        <span class="title">{{ node.label }}</span>
                    </el-tooltip>
                </span>
            </el-tree>
        </div>
    </div>
</template>
<script>
export default {
    name: 'MdSearchTree',
    props: {
        search: {
            type: Boolean,
            default: true,
            validator: val => typeof val === 'boolean',
        },
        placeHodlerText: {
            type: String,
            default: '搜索',
            validator: val => typeof val === 'string',
        },
        width: {
            type: Number,
            default: 200,
            validator: val => !isNaN(val),
        },
        height: {
            type: Number,
            default: 500,
            validator: val => !isNaN(val),
        },
    },
    data() {
        return {
            filterText: '',
        };
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    computed: {
        computedStyle() {
            return {
                width: `${this.width}px`,
                height: `${this.height}px`,
            };
        },
    },
    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        }
    },

};
</script>
