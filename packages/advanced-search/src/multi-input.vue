<template>
    <md-multiple-input
        :isQuery="isQuery"
        ref="multiple-input"
        v-bind="$attrs"
        @change="handleChange('inputVal', $event)"
        @select="handleChange('selVal', $event)"
        @search="handleVal"
    >
    </md-multiple-input>
</template>

<script>
import emitter from 'element-ui/src/mixins/emitter';
import MdMultipleInput from '../../multiple-input';
import { isArray, isEmpty } from '@master_vantop/vantop-util';

export default {
    name: 'MultiInput',
    inheritAttrs: true,
    mixins: [emitter],
    components: {
        MdMultipleInput
    },
    props: {
        prop: String,
        value: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            inputVal: null,
            selVal: '',
            isQuery: false,
        };
    },
    computed: {
        hasSelect() {
            return !isEmpty(this.$attrs.selectOptions);
        },
    },
    watch: {
        value: {
            handler(val) {
                let multipleInput = this.$refs['multiple-input'];
                if (multipleInput) {
                    this.syncSelectInput(multipleInput, val);
                } else {
                    this.$nextTick(() => {
                        multipleInput = this.$refs['multiple-input'];
                        this.syncSelectInput(multipleInput, val);
                    });
                }
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        getIsQuery() {
            const val = this.hasSelect
                ? this.value?.[1] || []
                : this.value;
            return !isEmpty(val);
        },
        handleChange(field, val) {
            this[field] = val;
            const value = this.hasSelect ? [this.selVal, this.inputVal] : this.inputVal;
            this.$emit('input', value);
            if (field === 'inputVal' && this.$refs?.['multiple-input']?.disabled) {
                this.dispatchOperate(this.prop, value);
            }
        },
        syncSelectInput(multipleInput, val) {
            const [selVal, inputVal] = this.hasSelect ? (val || []) : [null, val];
            this.selVal = selVal;
            this.inputVal = inputVal;
            const {
                selectValue: oldSelVal,
                value: oldInputVal
            } = multipleInput || {};

            if (this.hasSelect && selVal !== oldSelVal) {
                multipleInput.selectValue = selVal || null;
            }
            const tempValue = isArray(inputVal)
                ? inputVal.join('\n')
                : inputVal;
            if (tempValue !== oldInputVal) {
                multipleInput.value = tempValue || null;
            }
        },
        handleVal() {
            const value = this.hasSelect ? [this.selVal, this.inputVal] : this.inputVal;
            this.$emit('input', value);
            this.dispatchOperate(this.prop, value);
        }
    }
};
</script>