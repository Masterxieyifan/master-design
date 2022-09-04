<!--
 * @Author: hongdong.liao
 * @Date: 2021-06-16 10:54:39
 * @LastEditors: 蔡远程
 * @LastEditTime: 2022-04-19 13:46:36
-->
<template>
    <div class="advanced-search--box" v-bind="$attrs" v-on="$listeners">
        <el-button
            v-if="customVisible"
            class="filter-custom-btn"
            type="text"
            @click="openDialog"
            :icon="customIcon"
        >
            {{filterName}}
        </el-button>
        <el-button
            v-show="$attrs.resultClear"
            class="filter-custom-btn"
            type="text"
            @click="handleReset"
            :icon="resetIcon"
        >
            {{resetTitle}}
        </el-button>
        <el-dialog
            v-if="customVisible"
            :title="filterName"
            v-bind="$attrs"
            v-on="$listeners"
            :visible.sync="dialogVisible"
            custom-class="advanced-search--dialog"
            @confirm="handleConfirm"
            show-footer
            @cancel="() => (dialogVisible = false)"
        >
            <div class="condition-container">
                <div class="has-select">
                    <div class="select-title">
                        <span class="flag"></span>
                        <span class="title">已显示条件</span>
                        <span class="desc">
                            最多可选{{ filterMaxLen }}个条件，拖拽可调整排序
                        </span>
                    </div>
                    <div class="select-box">
                        <draggable
                            :animation="animation"
                            :ghost-class="ghostClass"
                            v-model="showList"
                            :component-data="getComponentData()"
                        >
                            <template v-for="(item, i) in showList">
                                <md-custom-condition-item
                                    :key="i"
                                    :status="item.status || ''"
                                    :disabled="true"
                                    :title="$g(item.label)"
                                    :closable="item.disabled !== true && item.status !== 'fixed'"
                                    @item-remove="handleItemRemove(item)"
                                ></md-custom-condition-item>
                            </template>
                        </draggable>
                        <span class="not-data" v-if="!showList.length">
                            暂无数据
                        </span>
                    </div>
                </div>
                <div class="not-select">
                    <div class="select-title">
                        <span class="flag"></span>
                        <span class="title">未显示条件</span>
                    </div>
                    <div class="select-box">
                        <template v-for="(item, i) in hideList">
                            <md-custom-condition-item
                                effect="plain"
                                :key="i"
                                :title="$g(item.label)"
                                :status="item.status || 'disabled'"
                                :disabled="item.disabled"
                                :maxDisabled="maxDisabled"
                                @item-add="handleItemAdd(item)"
                            ></md-custom-condition-item>
                        </template>
                        <span class="not-data" v-if="!hideList.length">
                            暂无数据
                        </span>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import MdCustomConditionItem from './item.vue';
import draggable from 'vuedraggable';
import { $g } from '../utils';
import { cloneDeep } from '@master_vantop/vantop-util';
import { draggableOptions, } from '@/mixins';

const FILTER_MAX_LEN = 10;
export { FILTER_MAX_LEN };

export default {
    name: 'MdCustomCondition',
    mixins: [ draggableOptions ],
    components: {
        MdCustomConditionItem,
        draggable
    },
    props: {
        customVisible: {
            type: Boolean,
            default: false
        },
        customIcon: {
            type: String,
            default: 'md-icon-assembly-16'
        },
        resetIcon: {
            type: String,
            default: 'md-icon-eliminate-16'
        },
        filterTitle: {
            type: String,
            default: ''
        },
        resetTitle: {
            type: String,
            default: '重置条件'
        },
        filterMaxLen: {
            type: Number,
            default: FILTER_MAX_LEN
        },
        activeFields: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            dialogVisible: false,
            showList: [],
            hideList: []
        };
    },
    computed: {
        filterName() {
            if (this.filterTitle) {
                return this.filterTitle;
            }
            return this.$attrs.title || this.title || '自定义条件';
        },
        dataSource: {
            set: function(data) {
                this.$emit('drag-end', data);
            },
            get: function() {
                return this.$attrs.data;
            }
        },
        maxDisabled() {
            return this.showList.length >= this.filterMaxLen;
        }
    },
    methods: {
        $g,
        openDialog() {
            // 数据处理格式化 showList/hideList
            const {
                $attrs: { data = [] },
                activeFields = []
            } = this;

            const conditionList = cloneDeep(data);

            const showList = [];
            const hideList = [];

            for (let item of conditionList) {
                if (activeFields.includes(item.prop)) {
                    if (item.status !== 'fixed') {
                        item.status = 'active';
                    }
                    showList.push(item);
                } else {
                    item.status = 'disabled';
                    item.disabled = true;
                    hideList.push(item);
                }
            }

            this.showList = showList.sort((a, b) =>
                activeFields.indexOf(a.prop) - activeFields.indexOf(b.prop)
            );

            this.hideList = hideList;

            this.dialogVisible = true;
        },
        handleConfirm() {
            this.dialogVisible = false;
            const activeFields = this.showList.map(({ prop }) => prop) || [];
            this.$emit('confirm-cond', activeFields);
        },
        handleReset() {
            this.$emit('reset-cond');
        },
        handleItemRemove(e) {
            const index = this.showList.findIndex(i => i.prop === e.prop);
            const [item] = this.showList.splice(index, 1);
            if (item?.status === 'fixed') {
                item.status = 'fixed';
            } else {
                item.status = 'disabled';
            }
            item.disabled = true;
            this.hideList.push(item);
        },
        handleItemAdd(e) {
            const index = this.hideList.findIndex(i => i.prop === e.prop);
            const [item] = this.hideList.splice(index, 1);
            if (item?.status === 'fixed') {
                item.status = 'fixed';
            } else {
                item.status = 'active';
            }
            item.disabled = false;
            this.showList.push(item);
        },
        handleEnd() {
            this.$emit('drag-sort', {
                all: [
                    ...this.showList.map(item => item.prop) || [],
                    ...this.hideList.map(item => item.prop) || [],
                ],
                active: this.showList.map(item => item.prop),
                disabled: this.hideList.map(item => item.prop),
            });
        },
        getComponentData() {
            return {
                on: {
                    end: this.handleEnd
                }
            };
        }
    }
};
</script>
