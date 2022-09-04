<template>
    <div class="select-search-input--container" @keydown.enter="onSearch">
        <div class="select-search-input--wrapper" :class="{'confirm-btn': hasConfirmBtn}">
            <el-input ref="selectInput" size="small" :placeholder="placeholder" v-on="_listeners" v-bind="$attrs"  v-model="val" class="select-input--inner" :searchable="hasConfirmBtn" @input="onInput">
                <el-select v-model="selectVal" :disabled="isDisabled" v-if="select" slot="prepend" :placeholder="selectPlaceholder" @change="onChange" :style="_selectStyle">
                    <el-option :label="label" :value="value" :key="value" v-for="({ label, value }) in options"></el-option>
                </el-select>
                <div ref="appendWrapper" class="append--wrapper" :class="{ 'disabled': isDisabled }" slot="suffix" @click="onSearch">
                    <span
                        v-if="isWordLimitVisible"
                        @click.stop
                        class="select-input-limit--words">{{valLength}}/{{$attrs.maxlength}}</span>
                </div>
            </el-input>
        </div>
    </div>
</template>

<script>
// const THROTTLE_TIME = 300;
export default {
    name: 'MdSelectInput',
    props: {
        select: {
            type: Boolean,
            default: false,
        },
        options: {
            type: Array,
            default: () => [],
        },
        hasConfirmBtn: {
            type: Boolean,
            default: true,
        },
        defaultSelectVal: {
            type: [String, Number],
            default: '',
        },
        emptyAutoSearch: {
            type: Boolean,
            default: false,
        },
        placeholder: {
            type: String,
            default: '请输入内容',
        },
        selectPlaceholder: {
            type: String,
            default: '请选择',
        },
        selectWidth: {
            type: Number,
            default: 100,
        },
        selectStyle: {
            type: Object,
        },
        isNumInput: {
            type: Boolean,
            default: false,
        },
        trimable: {
            type: Boolean,
            default: false,
        },
        showWordLimit: {
            type: Boolean,
            default: false,
        }
    },
    computed: {
        _selectStyle() {
            return {
                width: `${this.selectWidth}px`,
                ...this.selectStyle,
            };
        },
        _listeners() {
            // eslint-disable-next-line
            const { input: _, ...rest } = this.$listeners;
            return rest;
        },
        isDisabled() {
            const keys = Object.keys(this.$attrs);
            return keys.includes('disabled') && this.$attrs.disabled !== false;
        },
        valLength() {
            if (typeof this.val === 'number') {
                return String(this.val).length;
            }

            return (this.val || '').length;
        },
        isWordLimitVisible() {
            return this.showWordLimit &&
            this.$attrs.maxlength;
        },
    },
    data() {
        return {
            val: '',
            inputTimer: null,
            selectVal: this.defaultSelectVal,
        };
    },
    mounted() {
        this.$nextTick(()=>{
            if (this.isWordLimitVisible) {
                const suffixDom = this.$refs.appendWrapper;
                const inputDom = this.$refs.selectInput.$el.querySelectorAll('.el-input__inner');
                if (suffixDom && inputDom) {
                    inputDom.forEach(item => {
                        item.style.paddingRight = `${suffixDom.clientWidth + 30}px`;
                    });
                }
            }
        });
    },
    methods: {
        onSearch() {
            if (this.isDisabled) return;
            if (this.select) this.$emit('search', this.val, this.selectVal);
            else this.$emit('search', this.val);
        },
        onInput() {
            if (this.isNumInput) this.val = this.val.replace(/[^0-9]/g, '');
            // if (this.inputTimer) {
            // clearTimeout(this.inputTimer);
            // }
            // throttle the event
            // this.inputTimer = setTimeout(() => {
            if (this.val) this.$emit('input', this.trimable ? this.val.trim() : this.val);
            else this.$emit('empty');
            // }, THROTTLE_TIME);
        },
        onChange() {
            this.$emit('select', this.selectVal);
        },
        handleClearText() {
            if (this.isDisabled) return;
            this.val = '';
            this.$emit('empty');
            if (this.emptyAutoSearch) {
                this.$emit('search');
            }
        },
        clear() {
            this.clearInput();
            this.clearSelect();
        },
        clearInput() {
            this.val = '';
        },
        clearSelect() {
            this.selectVal = this.defaultSelectVal;
        },
        setInputVal(value) {
            if (this.isNumInput) value = value.replace(/[^0-9]/g, '');
            this.val = value;
        },
        setSelectVal(value) {
            this.selectVal = value;
        },
    },
};
</script>