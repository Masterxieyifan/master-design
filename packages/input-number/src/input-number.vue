<template>
    <el-input
        v-if="!ranged"
        ref="VantopInputNumber"
        :value="$value"
        :clearable="clearable"
        :disabled="disabled"
        :validateEvent="validateEvent"
        v-bind="$attrs"
        :label="label"
        @blur="handleBlur"
        @focus="handleFocus"
        @change="handlechange"
        @input="handleInput"
        @clear="handleClear"
        @keyup.enter.native="handleEnter"
        :class="{'is-query': isQuery}"
    >
        <template v-for="k in Object.keys(this.$slots)">
            <slot :slot="k" :name="k" />
        </template>
    </el-input>
    <div
        v-else
        ref="VantopInputNumber"
        class="vantop-number-range el-range-editor el-input__inner"
        :class="{
            'is-range-error': isRangeError,
            'is-disabled': inputDisabled,
            'is-query': isQuery
        }"
        :style="_inputStyle"
        @mouseenter="handleRangedMouseEnter"
        @mouseleave="numRanged.showClose = false"
    >
        <div class="el-input__wrap">
            <input
                class="el-range-input"
                autocomplete="off"
                :value="$value[0]"
                :placeholder="startPlaceholder"
                :disabled="inputDisabled || startDisabled"
                @input="handleStartInput"
                @focus="handleFocus"
                @blur="handleBlur($event, 'range')"
                @change="handleStartChange"
                @keyup.enter="handleEnter"
            >
            <slot name="range-separator">
                <span class="el-range-separator">
                    {{ rangeSeparator }}
                </span>
            </slot>
            <input
                class="el-range-input"
                autocomplete="off"
                :value="$value[1]"
                :placeholder="endPlaceholder"
                :disabled="inputDisabled || endDisabled"
                @input="handleEndInput"
                @focus="handleFocus"
                @blur="handleBlur($event, 'range')"
                @change="handleEndChange"
                @keyup.enter="handleEnter"
            >
            <i
                v-show="!inputDisabled && !startDisabled && !endDisabled && clearable"
                @click="handleRangedClear"
                :class="[numRanged.showClose ? '' + clearIcon : '']"
                class="el-input__icon el-range__close-icon">
            </i>
        </div>
        <span class="el-input__prefix" v-show="label" ref="prefix">
            <span class="label el-input__label">
                {{ label }}
            </span>
        </span>
    </div>
</template>

<script>
import { isEmpty, isObjDeepEqual } from '@master_vantop/vantop-util';
import emitter from 'element-ui/src/mixins/emitter';

const isNullUndefined = val => val === null || val === undefined;
const isNotNullUndefined = val => val !== null && val !== undefined;

export default {
    name: 'MdInputNumber',
    componentName: 'InputNumber',
    mixins: [emitter],
    model: {
        prop: 'value',
        event: 'input-bind'
    },
    props: {
        isQuery: {
            type: Boolean,
            default: false
        },
        value: {
            type: [String, Number, Array],
            default() {
                if (this.type === 'range') return [];
                return '';
            }
        },
        type: {
            trype: String,
            default: ''
        },
        rangeSeparator: {
            default: '-'
        },
        intLength: {
            type: Number,
            validator(val) {
                return val > 0 && val === parseInt(val, 10);
            },
            default: 7
        },
        precision: {
            type: Number,
            validator(val) {
                return val >= 0 && val === parseInt(val, 10);
            },
            default: 2
        },
        max: {
            type: Number,
            default: Infinity
        },
        min: {
            type: Number,
            default: -Infinity
        },
        zeroize: {
            type: Boolean,
            default: false,
        },
        negative: {
            type: Boolean,
            default: true,
        },
        hasSeperator: {
            type: Boolean,
            default: false
        },
        seperatorSign: {
            type: String,
            default: ',',
            validator(val) {
                const reg = /[`~!@#$%^&*()_\-+=<>?:"{}|,/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、\s]/;
                return reg.test(val);
            }
        },
        startPlaceholder: {
            type: String,
            default: '',
        },
        endPlaceholder: {
            type: String,
            default: ''
        },
        startDisabled: {
            type: Boolean,
            default: false,
        },
        endDisabled: {
            type: Boolean,
            default: false
        },
        label: {
            type: String
        },
        clearable: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        validateEvent: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            inputing: false,
            isEnd: false,
            numRanged: {
                showClose: false
            },
            isOverlimitPrefix: false,
            prefixWidth: 0,
            clearIcon: 'md-icon-clear-fill-16'
        };
    },
    watch: {
        value: {
            immediate: true,
            handler(value, oldValue) {
                if (this.ranged) {   // 区间范围
                    if (isEmpty(value) || isObjDeepEqual(value, oldValue)) {
                        return;
                    }

                    let [ startVal, endVal ] = value;
                    startVal = this.formatNumber(startVal);
                    endVal = this.formatNumber(endVal);

                    if (startVal) {
                        if (startVal > this.max) {
                            startVal = this.max;
                        }
                        if (startVal < this.min) {
                            startVal = this.min;
                        }
                    }

                    if (endVal) {
                        if (endVal > this.max) {
                            endVal = this.max;
                        }
                        if (endVal < this.min) {
                            endVal = this.min;
                        }
                    }

                    startVal = this.formatNumber(startVal);
                    endVal = this.formatNumber(endVal);

                    if (this.zeroize) {
                        startVal = this.handleZero(startVal);
                        endVal = this.handleZero(endVal);
                    }
                    this.$emit('input-bind', [startVal, endVal]);
                    if (this.inputing && this.isEnd) {
                        this.$emit('input', [startVal, endVal]);
                        this.inputing = false;
                        this.isEnd = false;
                    }
                } else {    // 单值
                    let newVal = value;
                    if (isNullUndefined(newVal)) {
                        return;
                    }

                    newVal = this.formatNumber(newVal);

                    if (newVal && newVal > this.max) {
                        newVal = this.zeroize ? this.handleZero(this.max) : this.max;
                    }
                    if (newVal && newVal < this.min) {
                        newVal = this.zeroize ? this.handleZero(this.min) : this.min;
                    }
                    this.$emit('input-bind', String(newVal));

                    if (this.inputing && this.isEnd) {
                        this.$emit('input', String(newVal));
                        this.inputing = false;
                        this.isEnd = false;
                    }
                }
            }
        },
    },
    computed: {
        $value() {
            if (this.hasSeperator && this.value) {
                if (this.ranged) {
                    const [startVal, endVal] = this.value;
                    if (this.validateEvent) this.dispatch('ElFormItem', 'el.form.change', [startVal, endVal]);
                    return [
                        startVal && this.numFormat(startVal, this.seperatorSign),
                        endVal && this.numFormat(endVal, this.seperatorSign)
                    ];
                }
                return this.numFormat(this.value, this.seperatorSign);
            }
            return this.value;
        },
        ranged() {
            return this.type.indexOf('range') > -1;
        },
        isRangeError() {
            let valid = false;
            if (this.ranged) {
                const [startVal, endVal] = this.value || [];
                if (isNotNullUndefined(startVal) && isNotNullUndefined(endVal)) {
                    valid = Number(endVal) < Number(startVal);
                }
            }
            return valid;
        },
        _inputStyle() {
            const style = {};
            if (this.isOverlimitPrefix) {
                style.paddingLeft = `${this.prefixWidth + 16}px`;
            }
            return style;
        },
        inputDisabled() {
            return this.disabled || (this.elForm || {}).disabled || (this.startDisabled && this.endDisabled);
        },
    },
    mounted() {
        setTimeout(() => {
            this.updatePrefixStatus();
        });
    },
    updated() {
        this.$nextTick(() => {
            this.updatePrefixStatus();
        });
    },
    methods: {
        numFormat(num, sign) {
            let res = num.toString().split('.');
            res[0] = res[0].replace(/\B(?=(\d{3})+(?!\d))/g, sign);
            return res.join('.');
        },
        formatNumber(val) {
            let newVal = String(val);

            //非数字处理
            const strRegex = this.negative ? /[^\d.-]/g : /[^\d.]/g;
            if (strRegex.test(newVal)) {
                newVal = newVal.replace(strRegex, '');
                return newVal;
            }

            //小数不支持.123写法
            const startPointRegex = /^\./g;
            if (startPointRegex.test(newVal)) {
                newVal = newVal.replace(startPointRegex, '');
                return newVal;
            }

            //整数数字不允许0开头，例0123
            const zeroStartRegex = /^0+(\d+)/g;
            if (zeroStartRegex.test(newVal)) {
                newVal = newVal.replace(zeroStartRegex, '$1');
                return newVal;
            }

            //负号处理
            if (this.negative) {
                const negativeRegex = /-+/g;
                if (negativeRegex.test(newVal)) {
                    newVal = newVal.replace(/^-/, '$@$').replace(/-/g, '').replace('$@$', '-');
                }
            }

            //小数点处理
            const pointRegex = /\.+/g;
            if (pointRegex.test(newVal)) {
                newVal = newVal.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
            }

            const pointIndex = newVal.indexOf('.');

            //精度长度处理
            if (this.precision && pointIndex > 0) {
                newVal = newVal.slice(0, pointIndex + this.precision + 1);
            }

            //整数长度处理
            if (this.intLength) {
                if (pointIndex > 0) {
                    const left = newVal.split('.')[0].slice(0, this.intLength);
                    newVal = this.precision === 0
                        ? left
                        : `${left}.${newVal.split('.')[1]}`;
                } else {
                    newVal = newVal.slice(0, this.intLength);
                }
            }

            if (this.inputing) this.isEnd = true;
            return newVal;
        },
        handleZero(val) {
            //当zeroize为true时，小数补零处理
            if (!this.precision) {
                return val;
            }

            let newVal = String(val);
            const pointIndex = newVal.indexOf('.');

            if (pointIndex > 0) {
                newVal = (newVal + Array(this.precision + 1).join(0))
                    .slice(0, pointIndex + 1 + this.precision);
            } else {
                newVal = `${newVal}.${Array(this.precision + 1).join(0)}`;
            }

            return newVal;
        },
        handleInput(val) {
            this.inputing = true;
            if (this.hasSeperator) {
                val = val.replace(new RegExp(this.seperatorSign, 'g'), '');
            }
            this.$emit('input-bind', val);
        },
        handlechange(val) {
            let newVal = (this.hasSeperator && !!val)
                ? this.value
                : val;

            if (!newVal || isNaN(newVal)) {
                this.$emit('input-bind', '');
                this.$emit('change', '');
                return;
            }

            if (this.zeroize) {
                newVal = this.handleZero(newVal);
                this.$emit('input-bind', newVal);
                this.$emit('change', newVal);
            } else {
                this.$emit('change', newVal);
            }
        },
        handleBlur(e, range) {
            if (range && this.validateEvent) {
                this.dispatch('ElFormItem', 'el.form.blur', this.$value);
            }
            this.$emit('blur', e);
        },
        handleFocus(e) {
            this.$emit('focus', e);
        },
        handleEnter() {
            this.$emit('enter');
        },
        handleClear() {
            this.$emit('clear');
        },
        blur() {
            this.$refs.VantopInputNumber.blur();
        },
        focus() {
            this.$refs.VantopInputNumber.focus();
        },
        select() {
            this.$refs.VantopInputNumber.select();
        },
        showClear() {
            return this.clearable &&
            !this.inputDisabled &&
            !this.readonly &&
            this.nativeInputValue &&
            (this.focused || this.hovering);
        },
        handleStartInput(e) {
            let startVal = e.target.value;
            this.inputing = true;
            if (this.hasSeperator) {
                startVal = startVal.replace(new RegExp(this.seperatorSign, 'g'), '');
            }
            const [, endVal = ''] = this.value;
            this.numRanged.showClose = !isEmpty(startVal) || !isEmpty(endVal);
            this.$emit('input-bind', [startVal, endVal]);
        },
        handleEndInput(e) {
            let endVal = e.target.value;
            this.inputing = true;
            if (this.hasSeperator) {
                endVal = endVal.replace(new RegExp(this.seperatorSign, 'g'), '');
            }
            const [startVal] = this.value;
            this.numRanged.showClose = !isEmpty(startVal) || !isEmpty(endVal);
            this.$emit('input-bind', [startVal, endVal]);
        },
        handleStartChange(e) {
            let startVal = e.target.value;
            startVal = (this.hasSeperator && !!startVal)
                ? this.value[0]
                : startVal;

            const [, endVal] = this.value;
            let newVal = [startVal, endVal];
            if (!startVal || isNaN(startVal)) {
                newVal = ['', endVal];
                this.$emit('input-bind', newVal);
                this.$emit('change', newVal);
                return;
            }

            if (this.zeroize) {
                startVal = this.handleZero(startVal);
                newVal = [startVal, endVal];
                this.$emit('input-bind', newVal);
                this.$emit('change', newVal);
            } else {
                this.$emit('change', newVal);
            }
        },
        handleEndChange(e) {
            let endVal = e.target.value;
            endVal = (this.hasSeperator && !!endVal)
                ? this.value[1]
                : endVal;

            const [startVal] = this.value;
            if (!endVal || isNaN(endVal)) {
                this.$emit('input-bind', [startVal, '']);
                this.$emit('change', [startVal, '']);
                return;
            }

            if (this.zeroize) {
                endVal = this.handleZero(endVal);
                this.$emit('input-bind', [startVal, endVal]);
                this.$emit('change', [startVal, endVal]);
            } else {
                this.$emit('change', [startVal, endVal]);
            }
        },
        handleRangedMouseEnter() {
            if (!this.value) {
                this.numRanged.showClose = false;
            } else if (this.value?.some((val) => isNotNullUndefined(val) && val !== '')) {
                this.numRanged.showClose = true;
            }
        },
        handleRangedClear() {
            if (!this.numRanged.showClose) {
                return;
            }
            const emptyValue = [];
            this.$emit('input-bind', emptyValue);
            this.$emit('change', emptyValue);
            this.$emit('clear');
        },
        updatePrefixStatus() {
            if (this.$refs.prefix) {
                const { clientWidth } = this.$refs.prefix;
                this.isOverlimitPrefix = clientWidth >= 32 - 8;
                this.prefixWidth = clientWidth;
            }
        },
    },
};
</script>