<template>
    <div class="md-custom-target">
        <div class="custom-target--left">
            <el-input
                v-model="search"
                clearable
                class="custom-target--left__search"
                prefix-icon="vl-icon-search-16"
                placeholder="请输入关键字"
            />
            <el-scrollbar
                class="custom-target--left__container"
                ref="listScrollbar"
            >
                <template v-if="showList.length > 0">
                    <ul
                        class="custom-target--list"
                        v-for="item in showList"
                        :key="item[titleKey]"
                    >
                        <span class="custom-target--list__title">{{item[titleKey]}}</span>
                        <li
                            :class="{
                                'tooltip-hover-target': true,
                                'custom-target--list__item': true,
                                'is-select': value.indexOf(child[valueKey]) > -1,
                                'is-max': selectedLen >= max
                            }"
                            v-for="child in item[childrenKey]"
                            :key="child[valueKey]"
                            @click="select(child[valueKey],item[valueKey])"
                            @mousemove="handleMouseMove(child[labelKey])"
                            @mouseleave="handleMouseLeave"
                        >
                            {{child[labelKey]}}
                        </li>
                    </ul>
                </template>
                <md-empty
                    v-show="showList.length <= 0"
                    title=""
                />
            </el-scrollbar>
        </div>
        <div class="custom-target--right">
            <div class="custom-target--right__header">
                <div class="tips">
                    <span>已选{{name}} ({{`${selectedLen}/${max}`}})</span>
                    <el-tooltip
                        effect="dark"
                        :content="`最多选择${max}个${name}`"
                        placement="top"
                    >
                        <i class="nt-icon-help-16"/>
                    </el-tooltip>
                </div>
                <el-button
                    type="text"
                    icon="nt-icon-delete-16"
                    @click="handleDelAll"
                >全部移除</el-button>
            </div>
            <el-scrollbar
                class="custom-target--right__container"
                ref="selectScrollbar"
            >
                <ul :class="{
                    'is-dragging': dragging,
                }">
                    <template v-if="selectedLen > 0">
                        <li
                            class="custom-target--selected"
                            v-for="id in value"
                            v-show="!isGroup"
                            :key="id"
                            :data-id="id"
                        >
                            <span
                                class="custom-target--selected__label"
                                @mousemove="handleMouseMove((valueMap[id] && valueMap[id][labelKey]) || id)"
                                @mouseleave="handleMouseLeave"
                            >{{(valueMap[id] && valueMap[id][labelKey]) || id}}</span>
                            <span>
                                <i
                                    class="nt-icon-close-16"
                                    @click="handleDel(id)"
                                />
                                <i class="nt-icon-drag-16"/>
                            </span>
                        </li>
                    </template>
                    <custom-target-group
                        v-if="isGroup"
                        ref="customTargetGroup"
                        v-bind="$attrs"
                        v-on="$listeners"
                    ></custom-target-group>
                    <md-empty
                        v-show="selectedLen <= 0"
                        title=""
                    />
                </ul>
            </el-scrollbar>
        </div>
        <el-tooltip
            v-model="tooltipShow"
            ref="tooltip"
            popper-class="custom-target--tooltip"
            placement="top"
            :open-delay="500"
            :content="tooltipText"
            :manual="true"
        />
    </div>
</template>

<script>
import Sortable from 'sortablejs';
import CustomTargetGroup from './custom-target-group';
export default {
    name: 'MdCustomTarget',
    provide() {
        return {
            customTarget: this
        };
    },
    components: {
        CustomTargetGroup
    },
    props: {
        // 选择列表的参数
        // [{
        //   name: '销售'
        //   children: [{
        //      label: '销量',
        //      value: 'saleNum'
        //   }]
        // }]
        data: {
            type: Array,
            default: ()=>[]
        },
        // 结果是否显示分组
        isGroup:{
            type: Boolean,
            default: false
        },
        // 最大选择个数
        max: {
            type: Number,
            default: 6
        },

        // data 列表自定义的字段名
        // {
        //     children: 'children',
        //     label: 'label',
        //     value: 'value',
        //     title: 'name',
        // }
        props: {
            type: Object,
            default: ()=>({})
        },
        value: {
            type: Array,
            default: ()=>[]
        },
        // 指标名称
        name: {
            type: String,
            default: '指标'
        }
    },
    data() {
        return {
            search: null,
            valueMap: {},
            showList: [],
            dragging: false,
            tooltipShow: false,
            tooltipText: ''
        };
    },
    computed: {
        childrenKey() {
            return this.props.children || 'children';
        },
        labelKey() {
            return this.props.label || 'label';
        },
        valueKey() {
            return this.props.value || 'value';
        },
        titleKey() {
            return this.props.title || 'name';
        },
        selectedLen() {
            return (this.value && this.value.length) || 0;
        },
    },
    watch: {
        data: {
            immediate: true,
            handler(val) {
                this.valueMap = {};
                for (let i = 0; i < val.length; i++) {
                    const children = val[i][this.childrenKey] || [];
                    for (let j = 0; j < children.length; j++) {
                        const child = children[j];
                        this.valueMap[child[this.valueKey]] = child;
                    }
                }
                this.showList = val;
            },
        },
        search: {
            immediate: true,
            handler(val) {
                const data = JSON.parse(JSON.stringify(this.data));
                if (!val) {
                    this.showList = data;
                    clearTimeout(this.timer);
                    this.timer = null;
                } else {
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        const showList = [];
                        const newVal = val.toLocaleLowerCase();
                        for (let i = 0; i < data.length; i++) {
                            let element = data[i];
                            element[this.childrenKey] = element[this.childrenKey]
                                .filter(item=>item[this.labelKey]
                                    ?.toLocaleLowerCase()
                                    .indexOf(newVal) > -1);
                            if (element[this.childrenKey].length > 0) showList.push(data[i]);
                        }
                        this.showList = showList;
                    }, 500);
                }
            },
        },
    },
    mounted() {
        this.$nextTick(()=>{
            const el = this.$refs.selectScrollbar.wrap.querySelector('ul');
            if (el) {
                this.sortableInstance = Sortable.create(el, {
                    animation: 250,
                    onStart: this.sortDropStart,
                    onEnd: this.sortDropEnd,
                });
            }
        });
    },
    methods: {
        sortDropStart() {
            this.dragging = true;
            this.tooltipShow = false;
        },
        sortDropEnd() {
            this.dragging = false;
            const data = this.sortableInstance.toArray();
            this.$emit('input', data);
            this.$emit('change', data);
        },
        handleMouseMove(text) {
            const target = event.target;
            if (this.mouseTimer) return;
            if (target.scrollWidth > target.clientWidth) {
                this.mouseTimer = setTimeout(() => {
                    this.$refs.tooltip.referenceElm = target;
                    this.tooltipShow = true;
                    this.tooltipText = text;
                    this.mouseTimer = null;
                }, 500);
            }
        },
        handleMouseLeave() {
            clearTimeout(this.mouseTimer);
            this.mouseTimer = null;
            this.tooltipShow = false;
            this.$refs.tooltip.referenceElm = this.$refs.tooltip.$el;
        },
        select(id, key) {
            const value = (this.value || []).slice();
            const index = value.indexOf(id);
            let canScroll = false;
            if ( index > -1) {
                value.splice(index, 1);
                this.isGroup && this.$nextTick(()=>{this.$refs.customTargetGroup.select(id, key, value.length < this.max);});
            } else if (value.length < this.max) {
                value.push(id);
                canScroll = true;
                this.isGroup && this.$nextTick(()=>{this.$refs.customTargetGroup.select(id, key, value.length < this.max);});
            }
            this.$emit('input', value);
            this.$emit('change', value);
            if (canScroll) {
                this.$nextTick(()=>{
                    const scrollbar = this.$refs.selectScrollbar;
                    if (scrollbar && scrollbar.wrap) {
                        scrollbar.wrap.scrollTop = 999;
                    }
                });
            }
        },
        handleDel(id) {
            this.select(id);
        },
        handleDelAll() {
            this.$emit('input', []);
            this.$emit('change', []);
            this.$emit('clear', []);
            this.isGroup && (this.$refs.customTargetGroup.checkedTargets = []);
        }
    },
};
</script>
