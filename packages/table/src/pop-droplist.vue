<template>
    <el-popover
        width="200"
        popper-class="pop-droplist--wrapper"
        ref="popper"
        v-model="popoverVisible"
        placement="bottom-end"
        trigger="manual"
    >
        <template slot="reference">
            <slot>
                <div class="popdroplist--trigger" @click="onReferenceBtnClick">
                    <el-button
                        iconed
                        type="info"
                        size="small"
                        icon="md-icon-table-deploy-16"
                        hint="自定义显示字段"
                    ></el-button>
                </div>
            </slot>
        </template>
        <template>
            <div class="pop-droplist-content--wrapper">
                <div class="hint">请选择列表需展示字段</div>
                <div class="select-all--wrapper" @click="handleCheckAllClick">
                    <el-checkbox
                        :indeterminate="isIndeterminate"
                        v-model="checkAll"
                        @click.native.prevent
                        >全选</el-checkbox
                    >
                </div>
                <el-checkbox-group
                    v-model="selectedSelections"
                    @change="handleCheckedItemChange"
                >
                    <template v-if="$table.sortable">
                        <draggable
                            v-model="showList"
                            :animation="animation"
                            :ghost-class="ghostClass"
                            :filter="'.is-disabled'">
                            <transition-group>
                                <div
                                    :class="{
                                        'is-disabled': typeof item.cancellable ===
                                            'boolean'
                                                ? !item.cancellable
                                                : false,
                                        'check-item--wrapper': true
                                    }"
                                    v-for="item in showList"
                                    :key="item.prop"
                                    @click="handleCheckItmeClick(item)"
                                >
                                    <el-checkbox
                                        :label="item.prop"
                                        :disabled="
                                            typeof item.cancellable ===
                                            'boolean'
                                                ? !item.cancellable
                                                : false
                                        "
                                        @click.native.prevent
                                    >
                                        <span :title="item.label">{{ item.label }}</span>
                                    </el-checkbox>
                                    <i
                                        v-if="typeof item.cancellable ===
                                            'boolean'
                                                ? item.cancellable
                                                : true"
                                        class="md-icon-drag-16 dragger-icon"/>
                                </div>
                            </transition-group>
                        </draggable>
                    </template>
                    <template v-else>
                        <div
                            class="check-item--wrapper"
                            v-for="item in showList"
                            :key="item.prop"
                            @click="handleCheckItmeClick(item)"
                        >
                            <el-checkbox
                                :label="item.prop"
                                :disabled="
                                    typeof item.cancellable === 'boolean'
                                        ? !item.cancellable
                                        : false
                                "
                                @click.native.prevent
                            >
                                <span :title="item.label">{{ item.label }}</span>
                            </el-checkbox>
                        </div>
                    </template>
                </el-checkbox-group>
            </div>
        </template>
    </el-popover>
</template>
<script>
import draggable from 'vuedraggable';
import { isObjDeepEqual, cloneDeep } from '@master_vantop/vantop-util';
import { draggableOptions, } from '@/mixins';
let msgInstance = null;

export default {
    name: 'pop-droplist',
    mixins: [ draggableOptions ],
    inject: ['$table'],
    components: {
        draggable
    },
    props: {
        originList: {
            // 本地配置
            type: Array,
            default: () => [],
            required: true
        },
        list: {
            // 已被排序
            type: Array,
            default: () => [],
            required: true
        },
        checkedList: {
            type: Array,
            required: true
        },
        defaultChecked: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            // showList: this.list,
            showList: [],
            checkAll: false,
            popoverVisible: false,
            isIndeterminate: false,
            selectedSelections: []
        };
    },
    watch: {
        checkedList() {
            this.__updateCheckedStatus(true);
        },
        list(val, oldVal) {
            if (!isObjDeepEqual(val, oldVal)) {
                this.showList = val;
                // added watch, in case it will change asynchronously
                if (this.defaultChecked) {
                    this.checkAllFunc();
                }
                // this.__emitRefresh(val);
                this.__emitRefresh(this.emitList);
            }
        }
    },
    computed: {
        emitList() {
            // 未勾选项 visible: false
            const _showList = cloneDeep(this.showList);
            const _selectedSelections = JSON.parse(
                JSON.stringify(this.selectedSelections)
            );
            for (let item of _showList) {
                const idx = _selectedSelections.findIndex(
                    prop => prop === item.prop
                );
                item.visible = false;
                if (idx > -1) {
                    _selectedSelections.splice(idx, 1);
                    item.visible = true;
                }
            }
            return _showList;
        }
    },
    mounted() {
        if (this.checkedList && this.checkedList.length) {
            this.__updateCheckedStatus();
            this.showList = this.checkedList;
        } else if (this.defaultChecked) {
            this.checkAllFunc();
            this.showList = this.list;
        }
        this.__emitRefresh(this.emitList);
    },
    methods: {
        handleCheckAllClick() {
            this.checkAll = !this.checkAll;
            this.handleCheckAllChange(this.checkAll);
        },
        handleCheckItmeClick(item) {
            if (typeof item.cancellable === 'boolean' && !item.cancellable) return;
            if (this.selectedSelections.includes(item.prop)) {
                const selectedSelections = this.selectedSelections.filter(
                    i => i !== item.prop
                );
                if (selectedSelections.length <=0 ) {
                    msgInstance && msgInstance.close();
                    msgInstance = this.$message.warning('至少保留一个列选项！');
                    return;
                }
                this.selectedSelections =selectedSelections;

            } else {
                this.selectedSelections.push(item.prop);
            }
            const { length: checkedLen } = this.selectedSelections;
            this.checkAll = checkedLen === this.list.length;
            this.isIndeterminate =
                checkedLen > 0 && checkedLen < this.list.length;
        },
        handleCheckAllChange(val) {
            if (val) {
                this.selectedSelections = this.list.map(i => i.prop);
                this.isIndeterminate = false;
            } else {
                // only one scene will keep the value: item is un-cancellable
                const list = this.list
                    .filter(({ cancellable }) =>
                        typeof cancellable === 'boolean'
                            ? !cancellable
                            : false
                    )
                    .map(i => i.prop);

                if (list.length <= 0) {
                    // 必须保持一个列选项选中
                    this.selectedSelections = [this.list[0]['prop']];
                    this.isIndeterminate = true;
                } else {
                    this.selectedSelections = list;
                    this.isIndeterminate = false;
                }
            }
        },
        handleCheckedItemChange(value) {
            const { length: checkedLen } = value;
            this.checkAll = checkedLen === this.list.length;
            this.isIndeterminate =
                checkedLen > 0 && checkedLen < this.list.length;
        },
        __emitRefresh(list) {
            this.$emit('refresh', list);
            // this.$refs.popper.doClose(); // we do not need it cause it has been close after emit refresh
        },
        checkAllFunc() {
            this.selectedSelections = this.showList.map(item => item.prop);
            this.checkAll = true;
        },
        onReferenceBtnClick(e) {
            e.stopPropagation();
            this.popoverVisible = !this.popoverVisible;
            if (!this.popoverVisible) {
                this.__emitRefresh(this.emitList);
            }
            if (!this.__documentListener) {
                document.addEventListener('click', this.__hidePopover);
                this.__documentListener = true;
            }
        },
        __updateCheckedStatus() {
            const checkedLen = this.checkedList.length;
            this.isIndeterminate =
                checkedLen > 0 && checkedLen < this.list.length;
            this.checkAll = checkedLen === this.list.length;
            this.selectedSelections = this.checkedList.map(i => i.prop);
            // this.showList = this.checkedList; // clear this temporarily
        },
        __hidePopover() {
            if (this.popoverVisible) {
                this.__emitRefresh(this.emitList);
                this.popoverVisible = false; // hide popover
            }
        }
    },
    beforeDestroy() {
        if (this.__documentListener) {
            document.removeEventListener('click', this.__hidePopover);
            this.__documentListener = null;
        }
    }
};
</script>