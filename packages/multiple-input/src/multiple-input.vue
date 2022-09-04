<template>
    <el-popover
        ref="multipleInputPopover"
        popper-class="multiple-input__popover"
        placement="bottom-start"
        :disabled="disabled"
        :visible-arrow="false"
        width="240"
        trigger="click"
        v-model="show">
        <el-input
            ref="textarea"
            size="small"
            v-model="value"
            @change="change"
            @keypress.enter.native="handleEnter"
            resize="none"
            :rows="11"
            :placeholder="textareaPlaceholder"
            type="textarea"/>
        <div class="multiple-input-button_group" v-if="showFooter">
            <el-button @click="clear" size="mini" type="info">清空</el-button>
            <el-button
                type="primary"
                size="mini"
                v-if="showSearch"
                @click="search">搜索</el-button>
        </div>
        <template v-if="disabled">
            <el-input
                :class="{'is-query': isQuery}"
                class="multiple-input__reference"
                slot="reference"
                :size="size"
                @change="change"
                placeholder="请输入"
                :clearable="clearable"
                :label="label"
                @clear="clear"
                v-model="value">
                <template v-for="k in Object.keys(this.$slots)" >
                    <slot :slot="k" :name="k" />
                </template>
                <el-select
                    v-if="selectOptions.length > 0"
                    slot="prepend"
                    :style="{'width': selectWidth}"
                    class="multiple-select"
                    :size="size"
                    v-model="selectValue"
                    @change="$emit('select', $event)"
                    placeholder="请选择">
                    <el-option
                        v-for="item in selectOptions"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"/>
                </el-select>
            </el-input>
        </template>
        <template v-else>
            <el-input
                :class="{'is-query': isQuery}"
                class="multiple-input__reference"
                slot="reference"
                :size="size"
                :placeholder="placeholder"
                @clear="clear(true)"
                :clearable="clearable"
                :label="label"
                :value="exhibitionText">
                <template v-for="k in Object.keys(this.$slots)">
                    <slot :slot="k" :name="k" />
                </template>
                <el-select
                    v-if="selectOptions.length > 0"
                    slot="prepend"
                    :style="{'width': selectWidth}"
                    class="multiple-select"
                    :size="size"
                    v-model="selectValue"
                    @change="$emit('select', $event)"
                    placeholder="请选择">
                    <el-option
                        v-for="item in selectOptions"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"/>
                </el-select>
            </el-input>
        </template>
    </el-popover>
</template>

<script>
import { isArray } from '@master_vantop/vantop-util';
export default {
    name: 'MdMultipleInput',
    props: {
        label: String,
        isQuery: {
            type: Boolean,
            default: false
        },
        clearable: {
            type: Boolean,
            default: true,
        },
        selectOptions: {
            type: Array,
            default: ()=>[],
        },
        selectDefault: {
            typr: [String, Number, Boolean],
            default: undefined
        },
        selectWidth: {
            type: String,
            default: 'auto',
        },
        size: {
            type: String,
            default: 'small',
        },
        emptyAutoSearch: {
            type: Boolean,
            default: false,
        },
        showFooter: {
            type: Boolean,
            default: true
        },
        showSearch: {
            type: Boolean,
            default: true
        },
        textareaPlaceholder: {
            type: String,
            default: '内容用逗号或换行区分，请避免空格 (Shift + 回车换行；回车立即搜索)'
        },
        placeholder: {
            type: String,
            default: '搜索多项内容'
        }
    },
    computed: {
        exhibitionText() {
            let text = this.formatData(this.value || '');
            text = text.replaceAll('$@$', ' ');
            return text;
        },
        disabled() {
            const res = this.selectOptions.filter(item => item.value === this.selectValue);
            if (res[0] && res[0].multiple !== undefined) {
                return !res[0].multiple;
            }
            return false;
        },
    },
    watch: {
        selectDefault: {
            immediate: true,
            handler: function(val) {
                this.selectValue = val;
            },
        },
        selectValue(val, oldVal) {
            const res = this.selectOptions.filter(item => item.value === val);
            const oldRes = this.selectOptions.filter(item => item.value === oldVal);
            if (res[0] && oldRes[0] && res[0].multiple !== oldRes[0].multiple) {
                if (this.value) {
                    this.value = null;
                    this.$refs.multipleInputPopover.showPopper = false;
                    this.change(null);
                }
            }
        },
        show(val) {
            if (val) {
                this.$nextTick(()=>{
                    this.$refs.textarea.focus();
                });
            }
        },
    },
    data() {
        return {
            selectValue: null,
            value: null,
            show: false,
        };
    },
    methods: {
        setInput(val) {
            this.value = isArray(val)
                ? val.join('\n')
                : val;
        },
        formatData(val) {
            if (val) {
                let newVal = val.replace(/\n/g, '$@$');
                newVal = newVal.replace(/,/g, '$@$');
                newVal = newVal.replace(/，/g, '$@$');
                return newVal;
            }
            return '';
        },
        change(val) {
            if (this.disabled) {
                this.$emit('change', val);
            } else {
                let newVal = this.formatData(val);
                newVal = newVal.split('$@$').filter(item=>item);
                this.$emit('change', newVal);
            }
        },
        close() {
            this.show = false;
        },
        clear(change = false) {
            this.value = null;
            this.$emit('clear');
            if (change) this.$emit('change', this.disabled ? '' : []);
            if (this.emptyAutoSearch) {
                this.$emit('search', {
                    select: this.selectValue,
                    input: this.disabled ? '' : []
                });
            }
            event.stopPropagation();
        },
        search() {
            let newVal = this.formatData(this.value);
            newVal = newVal.split('$@$').filter(item=>item);
            this.$emit('search', {
                select: this.selectValue,
                input: this.disabled ? this.value : newVal
            });
            this.close();
            event.stopPropagation();
        },
        handleEnter() {
            if (event.shiftKey) return;
            event.preventDefault();
            // 保证 search 在 change 事件之后触发
            this.$refs.textarea.blur();
            this.$nextTick(()=>{
                this.search();
            });
        },
    },
};
</script>
