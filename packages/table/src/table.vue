<template>
    <div
        :class="{
            'vantop-table--wrapper': true,
            'is--toolbar': hasToolbar,
            'is--padding': padding,
            'is--pagination': hasPagination,
            'is--form': form,
        }"
    >
        <div class="vantop-table--container">
            <div
                v-if="hasToolbar"
                :class="[
                    'toolbar--wrapper',
                    'toolbar--customer--wrapper',
                    headerRowClassName
                ]"
                :style="toolbarStyle"
            >
                <PopDroplist
                    :defaultChecked="!storage"
                    :checkedList="checkedColumns"
                    :list="popList"
                    :originList="columns"
                    @refresh="handleToolbarRefresh"
                />
            </div>
            <vxe-table
                class="flex-1 vxe-table"
                ref="tableInstance"
                v-bind="$attrs"
                v-on="$listeners"
                round
                auto-resize
                :data="data"
                :size="size"
                :height="height"
                :border="border"
                :sync-resize="false"
                :resizable="resizable"
                :max-height="maxHeight"
                :tooltip-config="tooltipConfig"
                :cell-class-name="_cellClassName"
                :highlight-hover-row="highlightHoverRow"
                :show-header-overflow="showHeaderOverFlow"
                :header-row-class-name="headerRowClassName"
                :header-cell-class-name="_headerCellClassName"
                @checkbox-change="handleSelectionChange"
                @radio-change="handleRadioChange"
                @checkbox-all="onSeletionAll"
                @scroll="handleScroll"
            >
                <template v-if="hasSelection">
                    <vxe-table-column
                        width="40"
                        fixed="left"
                        field="MDCheckboxColumn"
                        :resizable="false"
                        :type="selectionMode"
                        :show-header-overflow="false"
                    />
                </template>
                <slot>
                    <template v-if="!hasDefaultSlot">
                        <table-column
                            v-for="(data,index) in loopColumns"
                            :data="data"
                            :key="`${data.prop || data.label}${index}`"
                        />
                    </template>
                </slot>
                <vxe-table-column
                    v-if="operations.length"
                    title="操作"
                    fixed="right"
                    field="MDOperationsColumn"
                    :resizable="false"
                    :width="operationWidth"
                >
                    <template #default="{ row, column, ...rest }">
                        <slot name="operations" v-bind="{ row, column }">
                            <operation-btns
                                :row="row"
                                :column="column"
                                :rest="rest"
                                :operations="operations"
                            />
                        </slot>
                    </template>
                </vxe-table-column>
                <template v-slot:empty>
                    <slot name="empty" v-if="_hasEmpty">
                        <md-empty
                            title=""
                            description="暂无数据"
                            :image="`${$options.staticBaseUrl}/saas/empty/empty-list.svg`" />
                    </slot>
                </template>
            </vxe-table>
            <div
                class="vantop-loading"
                v-show="loading"
            >
                <div class="el-loading-spinner">
                    <svg
                        viewBox="25 25 50 50"
                        class="circular"
                    >
                        <circle
                            cx="50"
                            cy="50"
                            r="20"
                            fill="none"
                            class="path"
                        />
                    </svg>
                </div>
            </div>
        </div>
        <div
            v-if="hasPagination"
            class="vantop-table-footer--wrapper"
        >
            <!-- Only has selection, these mutiple operations will exist -->
            <div
                class="footer-buttons"
                v-if="hasSelection && selectionMode === 'checkbox'"
            >
                <div class="select-all-wrapper">
                    <vxe-checkbox
                        v-model="selectAll"
                        :indeterminate="isSelectAllIndeterminate"
                        :disabled="data.length === 0"
                        @change="handleSelectAllChange"
                    >
                        <template v-if="selections.length">已选中 <span style="color:#FD5E15">{{selections.length}}</span> 条</template>
                        <template v-else>全选</template>
                    </vxe-checkbox>
                </div>
                <slot name="footer-btn" v-bind="{ selections }"/>
            </div>
            <div class="flex1"/>
            <el-pagination
                :pager-count="5"
                @size-change="handlePageSizeChange"
                @current-change="handleCurrentPageChange"
                :current-page="pagination.current"
                :page-sizes="pageSizes"
                :page-size="pagination.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total"
            />
        </div>
    </div>
</template>
<script>
import { cloneDeep } from '@master_vantop/vantop-util';
import { staticBaseUrl, } from '@/util';
import PopDroplist from './pop-droplist';
import TableColumn from './table-column';
import OperationBtns from './operation-btns';
import MdEmpty from '../../empty';

const INIT_PAGE_VAL = {
    CURRENT: 1,
    SIZE: 20
};

const PADDING_VAL = 24;

export default {
    name: 'MdTable',
    provide() {
        return {
            $table: this
        };
    },
    components: {
        MdEmpty,
        PopDroplist,
        OperationBtns,
        TableColumn
    },
    staticBaseUrl,
    props: {
        tooltipConfig: {
            type: Object,
            default: ()=>({
                enterable:true
            })
        },
        size: {
            type: String,
            default: 'small',
            validator: val => ['medium', 'small', 'mini'].includes(val)
        },
        height: {
            type: [String, Number],
            default: ''
        },
        border: {
            type: [String, Boolean],
            default: 'inner'
        },
        // only exist when table need selection
        hasSelection: {
            type: Boolean,
            default: true
        },
        selectionMode: {
            type: String,
            default: 'checkbox',
            validator: val => ['checkbox', 'radio'].includes(val)
        },
        isFixedSelection: {
            type: Boolean,
            default: true
        },
        hasPagination: {
            type: Boolean,
            default: true
        },
        hasToolbar: {
            type: Boolean,
            default: true
        },
        data: {
            required: true,
            type: Array
        },
        columns: {
            required: true,
            type: Array
        },
        total: {
            type: Number
        },
        operations: {
            type: Array,
            default: () => []
        },
        padding: {
            type: Boolean,
            default: false
        },
        storage: {
            type: Boolean,
            default: false
        },
        storageKey: {
            type: String
        },
        storageColumnProps: {
            type: Array,
            default: () => []
        },
        loading: {
            type: Boolean,
            default: false
        },
        operationWidth: {
            type: [Number, String],
            default: 80,
            validator: val => !isNaN(val)
        },
        cellClassName: {
            type: String,
            default: ''
        },
        headerCellClassName: {
            type: String,
            default: ''
        },
        maxHeight: {
            type: [Number, String],
            default: ''
        },
        resizable: {
            type: Boolean,
            default: true
        },
        showHeaderOverFlow: {
            type: Boolean,
            default: true
        },
        highlightHoverRow: {
            type: Boolean,
            default: true
        },
        sortable: {
            type: Boolean,
            default: true
        },
        pageSizes: {
            type: Array,
            default: () => [20, 50, 100]
        },
        // 自定义表头样式 默认gray 可选white
        headerRowClassName: {
            type: String,
            default: 'gray'
        },
        _hasEmpty: {
            type: Boolean,
            default: true
        },
        form: {
            type: Boolean,
            default: false
        },
    },

    computed: {
        toolbarStyle() {
            const hasBorder = !['header', 'inner', 'none'].includes(this.border);
            const borderWidth = hasBorder ? 3 : 2;
            const position = hasBorder ? '1px' : 0;
            let styleObj = {
                top: position,
                right: position
            };
            const headerHeight = this.tableInstance?.headerHeight || 40;
            styleObj.height = `${headerHeight - borderWidth}px`;
            if (this.padding && this.hasToolbar) styleObj.right = `${PADDING_VAL}px`;

            return styleObj;
        },
        // Table Section
        _cellClassName() {
            return `vantop-table-cell ${this.cellClassName}`;
        },
        _headerCellClassName() {
            return `vantop-table-header-cell ${this.headerCellClassName}`;
        },
        hasDefaultSlot() {
            return !!(this.$scopedSlots && this.$scopedSlots.default);
        },
        loopColumns() {
            if (this.storage && this.storageKey && this.storageColumnProps) {
                return this.checkedColumns;
            }
            return this.showColumns;
        },
        // 列操作弹窗显示列表
        popList() {
            if (this.storage && this.storageKey && this.storageColumnProps) {
                const columnProps = [];
                const _columns = cloneDeep(this.columns);
                for (const item of this.storageColumnProps) {
                    const idx = _columns.findIndex(
                        ({ prop }) => item.prop === prop
                    );
                    if (idx > -1) {
                        const obj = _columns.splice(idx, 1)[0];
                        columnProps.push(obj);
                    }
                }
                return columnProps;
            }
            return this.columns;
        }
    },
    data() {
        return {
            // Table Section
            tableInstance: null,
            // Selection Seciton
            selectAll: false,
            selections: [],
            isSelectAllIndeterminate: false,
            // Pagination Section
            pagination: {
                current: INIT_PAGE_VAL.CURRENT,
                size: INIT_PAGE_VAL.SIZE,
                total: this.total || this.data.length
            },
            // Toolbar Section
            showColumns: this.columns,
            checkedColumns: this.columns,
            resizeSensorListener: null,
            activeWatch: true,
            operationInstance: null
        };
    },
    watch: {
        data() {
            if (!this.activeWatch) {
                return;
            }
            if (this.$refs.tableInstance) {
                // add nextick, in case the data is not the lastest
                this.$nextTick(() => {
                    const records = this.$refs.tableInstance.getCheckboxRecords();
                    this.__refreshSelectAllStatus(records);
                });
            }
        },
        // once total changed, re-value the pagination's total
        total(val) {
            if (!this.activeWatch) {
                return;
            }
            this.pagination.total = val;
        },
        columns(val) {
            if (!this.activeWatch) {
                return;
            }
            // #FIXBUG showColumns do not referesh
            this.showColumns = val;
            // 针对 columns 动态变化或在 mixin mounted 之后赋值
            this.$emit('storage-columns-change', null, true);
        },
        storageColumnProps(val) {
            if (!this.activeWatch) {
                return;
            }
            const columnProps = [];
            const _columns = cloneDeep(this.columns);
            for (const item of val) {
                const idx = _columns.findIndex(
                    ({ prop }) => item.prop === prop
                );

                if (idx > -1 && item.visible !== false) {
                    const obj = _columns.splice(idx, 1)[0];
                    columnProps.push(obj);
                }
            }
            this.checkedColumns = columnProps;
        },
    },
    mounted() {
        this.tableInstance = this.$refs.tableInstance;
    },
    activated() {
        this.activeWatch = true;
    },
    deactivated() {
        this.activeWatch = false;
    },
    beforeDestroy() {
        this.resizeSensorListener &&
            this.resizeSensorListener.detach &&
            this.resizeSensorListener.detach();
    },
    methods: {
        setCheckboxRow(selections, checked) {
            if (!Array.isArray(selections)) {
                throw TypeError('[Error] selections must be array!');
            }
            this.tableInstance.setCheckboxRow(selections, checked);
            this.$nextTick(() => {
                const records = this.$refs.tableInstance.getCheckboxRecords();
                this.__refreshSelectAllStatus(records);
            });
        },
        /**
         * SELECTION SECTION
         */
        __refreshSelectAllStatus(records) {
            this.isSelectAllIndeterminate =
                records.length < this.data.length && records.length > 0;
            if (records.length && records.length === this.data.length) {
                if (!this.selectAll) this.selectAll = true;
            } else {
                if (this.selectAll) this.selectAll = false;
            }
            this.selections = records;
        },
        // eslint-disable-next-line
        handleSelectionChange({ _, records }) {
            this.__refreshSelectAllStatus(records);
            this.$emit('select', records);
        },
        handleRadioChange(records) {
            const { row } = records;
            this.$emit('select', [row]);
        },
        handleSelectAllChange() {
            this.$refs.tableInstance.toggleAllCheckboxRow();
        },
        onSeletionAll({ records }) {
            this.isSelectAllIndeterminate = false;
            this.selectAll = records.length !== 0;
            this.selections = records;
            this.$emit('select', records);
        },
        getSelectedRow() {
            return this.selections;
        },
        clearSelection() {
            this.$refs.tableInstance.clearCheckboxRow().then(() => {
                this.selectAll = false;
                this.selections = [];
                this.isSelectAllIndeterminate = false;
            });
        },
        resetPagination() {
            this.pagination.current = INIT_PAGE_VAL.CURRENT;
            this.pagination.size = INIT_PAGE_VAL.SIZE;
            this.pagination.total = this.total || this.data.length;
        },
        resetPaginationSize() {
            this.pagination.size = INIT_PAGE_VAL.SIZE;
            this.pagination.total = this.total || this.data.length;
        },
        resetPaginationCurrent() {
            this.pagination.current = INIT_PAGE_VAL.CURRENT;
            this.pagination.total = this.total || this.data.length;
        },
        setPaginationCurrent(current) {
            this.pagination.current = current;
        },
        setPaginationSize(size) {
            this.pagination.size = size;
        },
        handlePageSizeChange(size) {
            this.pagination.size = size;
            this.$emit('size-change', this.pagination);
            this.$emit('refresh', this.pagination);
        },
        handleCurrentPageChange(current) {
            this.pagination.current = current;
            this.$emit('current-page-change', this.pagination);
            this.$emit('refresh', this.pagination);
        },
        // handlde pagination change
        handlePageChange({ pageSize, currentPage }) {
            // emit size change
            if (this.pagination.size !== pageSize) {
                this.pagination.size = pageSize;
                this.$emit('size-change', this.pagination);
                // emit current change
            } else if (this.pagination.current !== currentPage) {
                this.pagination.current = currentPage;
                this.$emit('current-page-change', this.pagination);
            }
            // emit page in case it needs to call api
            this.$emit('refresh', this.pagination);
        },
        handleToolbarRefresh(columns) {
            // prevent user hide show on or off different height of columns
            const _columns = columns.filter(item => item.visible !== false);
            this.showColumns = _columns;
            this.$emit('column-change', _columns);
            // prevent the old version, in case it will throw an error
            this.$emit('columns-change', _columns);
            if (this.storage) {
                this.$emit('storage-columns-change', columns);
            }
            // prevent api call when do not have a storagekey
            if (!this.storageKey) {
                return;
            }
        },
        /*
         * handle scroll
         */
        handleScroll({ isY }) {
            if (isY && this.operationInstance) this.operationInstance.hide();
        },
    }
};
</script>

