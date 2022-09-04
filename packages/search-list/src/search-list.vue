<template>
<div class="ccfs-search-list--wrapper" :class="{ 'top': topPadding, 'bottom': bottomPadding }" :style="computedStyle">
    <div class="ccfs-search-input--wrapper" :class="{ 'left': leftPadding, 'right': rightPadding }">
        <input
            type="text"
            v-model="inputValue"
            :placeholder="placeHolderText"
            @input="__handleInput"
        >
    </div>
        <el-scrollbar
            :wrap-class="wrapperClass"
            :style="listWrapperStyle" ref="scrollBar">
            <ul v-if="loopList.length">
                <li
                    v-for="(item, index) in loopList"
                    :key="item[valueKey] || index"
                    :class="['search-list--item', selectedIndex === item[valueKey] ? 'selected' : '']"
                    @click="__handleItemClick(item)"
                >
                <!-- transfer other work except ASCII char to ASCII char -->
                <template v-if="item[labelKey].replace(/[^x00-xff]/g, '01').length > TEXT_OVERFLOW_LENGTH">
                    <el-tooltip effect="dark" :content="item[labelKey]" placement="top-start">
                        <span>{{item[labelKey]}}</span>
                    </el-tooltip>
                </template>
                <template v-else>
                    <span>{{item[labelKey]}}</span>
                </template>
                <!-- #TODO change it to vantop's own tooltip -->
                    <div class="operations">
                        <slot name="operations" v-bind:item="item">
                            <i
                                class="md-icon-edit-16"
                                v-if="item.editable || editable"
                                @click.stop="__handleEdit(item)"
                            ></i>
                            <i
                                class="md-icon-delete-16"
                                v-if="item.deletable || deletable"
                                @click.stop="__handleDelete(item)"
                            ></i>
                            <slot name="extraOperation" v-bind:item="item"></slot>
                        </slot>
                    </div>
                </li>
            </ul>
            <div
                class="non-data--text"
                v-else-if="showNonDataText"
            >
                {{nonDataText}}
            </div>
        </el-scrollbar>
</div>
</template>
<script>

const THROTTLE_TIME = 300;
export default {
    name: 'MdSearchList',
    props: {
        scrollBarClass: {
            type: String,
        },
        emit: {
            type: Boolean,
            default: false,
            validator: val => typeof val === 'boolean',
        },
        list: {
            type: Array,
            default: new Array(),
            validator: val => !!val && Array.isArray(val),
        },
        editable: {
            type: Boolean,
            default: true,
            validator: val => typeof val === 'boolean',
        },
        deletable: {
            type: Boolean,
            default: true,
            validator: val => typeof val === 'boolean',
        },
        defaultActive: {
            type: [Number, String],
            default: null,
            validator: val => typeof val === 'string' || !isNaN(val),
        },
        maxWidth: {
            type: Number,
            default: 200,
            validator: val => !isNaN(val),
        },
        maxHeight: {
            type: [Number, String],
            default: 200,
        },
        valueKey: {
            type: String,
            default: 'value',
            validator: val => !!val && typeof val === 'string',
        },
        labelKey: {
            type: String,
            default: 'label',
            validator: val => !!val && typeof val === 'string',
        },
        placeHolderText: {
            type: String,
            default: '搜索',
            validator: val => typeof val === 'string',
        },
        showNonDataText: {
            type: Boolean,
            default: true,
            validator: val => typeof val === 'boolean',
        },
        nonDataText: {
            type: String,
            default: '暂无数据',
            validator: val => typeof val === 'string',
        },
        leftPadding: {
            type: Boolean,
            default: true,
        },
        rightPadding: {
            type: Boolean,
            default: true,
        },
        topPadding: {
            type: Boolean,
            default: true,
        },
        bottomPadding: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        computedStyle() {
            return {
                maxWidth: `${this.maxWidth}px`,
            };
        },
        listWrapperStyle() {
            let _height = this.maxHeight;
            if (typeof this.maxHeight === 'number') {
                _height = `${_height}px`;
            }
            return {
                height: _height, // subtract the height of search bar
            };
        },
        loopList() {
            return this.emit ? this.list : this.showList;
        },
        compareIndex() {
            return this.selectedIndex;
        },
        wrapperClass() {
            const arr = ['ccfs-search-list--wrapper'];
            if (this.rightPadding) {
                arr.push('right');
            }
            if (this.leftPadding) {
                arr.push('left');
            }
            if (this.scrollBarClass) {
                arr.push(this.scrollBarClass);
            }
            return arr.join(' ');
        },
    },
    mounted() {
        if (!this.emit) {
            this.originList = this.list;
            this.__setShowList(this.originList);
            // Hanlde initial active index
            if (![undefined, null].includes(this.defaultActive)) {
                this.selectedIndex = this.defaultActive;
            }
        }
    },
    updated() {
        this.$refs.scrollBar && this.$refs.scrollBar.update();
    },
    data() {
        return {
            TEXT_OVERFLOW_LENGTH: 16,
            showList: [],
            originList: [],
            inputValue: '',
            inputTimer: null,
            selectedIndex: null,
        };
    },
    watch: {
        list: {
            deep: true,
            handler(val) {
                if (this.$refs.scrollBar) {
                    this.$refs.scrollBar.update();
                }
                if (!this.emit) {
                    this.originList = val;
                    this.__setShowList(this.originList);
                }
            },
        },
    },
    methods: {
        __handleDelete(row) {
            this.$emit('delete', row);
        },
        __handleEdit(row) {
            this.$emit('edit', row);
        },
        __handleInput() {
            if (this.inputTimer) {
                clearTimeout(this.inputTimer);
            }
            this.inputTimer = setTimeout(() => {
                if (!this.inputValue) {
                    if (this.emit) {
                        this.$emit('emptyInput');
                    } else {
                        this.__handleEmptyText();
                    }
                    return;
                }
                if (this.emit) {
                    this.$emit('search', this.inputValue);
                } else {
                    this.__handleSearch();
                }
            }, THROTTLE_TIME);
        },
        __handleEmptyText() {
            this.__setShowList(this.originList);
        },
        __handleSearch() {
            const list = this.originList.filter(item => ~item[this.labelKey].indexOf(this.inputValue));
            // clear selected status
            this.selectedIndex = null;
            this.__setShowList(list);
        },
        __setShowList(list) {
            this.showList = list;
        },
        __handleItemClick(item) {
            if (!this.emit) {
                this.selectedIndex = item[this.valueKey];
            }
            this.$emit('click', item);
        },
    },
    beforeDestroy() {
        clearTimeout(this.inputTimer);
    }
};
</script>
