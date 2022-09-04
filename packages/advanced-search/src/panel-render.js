import { isFunction, getType, isEmpty } from '@master_vantop/vantop-util';
import Emitter from 'element-ui/src/mixins/emitter';
import { $g } from '../utils';
import SelectInput from './select-input.vue';
import MultiInput from './multi-input.vue';
import SelectInputNumber from './select-input-number.vue';
import DatePicker from './date-picker.vue';

let VNode;

const WIDTH = '240px';

const SUPPORT_TYPE = [
    'Input', 'MultiInput', 'Select', 'Cascader', 'InputNumber', 'TimePicker', 'TimeSelect', 'DatePicker', 'SelectInput', 'SelectDate', 'Autocomplete'
];

export default {
    name: 'Render',
    mixins: [Emitter],
    components: {
        SelectInput,
        MultiInput,
        SelectInputNumber,
        DatePicker
    },
    props: {
        prop: [Function, String],
        label: [Function, String],
        render: {
            type: [Function, Object],
            required: true,
            default: () => ({ })
        },
        extraOpts: {
            type: Object,
            default: () => ({ })
        }
    },
    data() {
        return {
            optionDatas: [],    // 选项数据(select, 后续如果其他类型也需要时统一以它为数据源维护)
        };
    },
    computed: {
        optionsSetting() {
            return this.render?.options;
        }
    },
    watch: {
        // 监听 render 对象中 options 配置
        optionsSetting: {
            async handler(val) {
                let options;
                if (isFunction(val)) {
                    let respData = await Promise.resolve(val());
                    if (Array.isArray(respData)) {
                        options = respData;
                    } else if (Array.isArray(respData?.records)) {    // 兼容接口不规范
                        options = respData.records;
                    }
                } else if (Array.isArray(val)) {
                    options = val;
                } else if (getType(val) === 'promise'){
                    let resultData = await val;
                    options = Array.isArray(resultData) ?  resultData : [];
                } else {
                    options = [];
                }
                this.optionDatas = options;
            },
            immediate: true,
            deep: true,
        }
    },
    mounted() {
        this.dispatch('OperateStorageHash', 'operate.children.change', this);
    },
    methods: {
        autoRenderFormat({ type, ...$attrs }) {
            if (!type) {
                throw new Error('Render object must provide the type!');
            }
            if (SUPPORT_TYPE.includes(type)) {
                const render = this[`render${type}`]($attrs);
                if (isFunction(render)) {
                    return render;
                }
                return () => render;
            }
            throw new Error(`Render support type: "${SUPPORT_TYPE.join(',')}", but your type: " ${type}!"`);
        },
        renderSelectDate({  placeholder = '请输入', clearable = true, attrType = 'date', ...attrs }) {
            const _this = this.$parent.pageParent;
            const prop = $g(this.prop);
            return (
                <md-select-date
                    {...{
                        props: attrs,
                        attrs: attrs
                    }}
                    prop={prop}
                    type={attrType}
                    v-model={_this.query[prop]}
                    placeholder={placeholder}
                    clearable={clearable}
                >
                </md-select-date>
            );
        },
        renderInput({ width = WIDTH, placeholder = '请输入', clearable = true, ...attrs }) {
            const _this = this.$parent.pageParent;
            const prop = $g(this.prop);
            const label = $g(this.label);
            return (
                <el-input
                    {...{
                        props: attrs,
                        attrs: attrs
                    }}
                    prop={prop}
                    v-model={_this.query[prop]}
                    label={label}
                    style={{ width }}
                    placeholder={placeholder}
                    clearable={clearable}
                >
                </el-input>
            );
        },
        renderMultiInput({ width = WIDTH,
            placeholder = '请输入多个',
            clearable = true,
            emptyAutoSearch = true,
            ...attrs }) {
            const _this = this.$parent.pageParent;
            const prop = $g(this.prop);
            const { selectOptions } = attrs;
            const label = isEmpty(selectOptions)
                ? $g(this.label)
                : undefined;
            return (
                <multi-input
                    {...{
                        props: attrs,
                        attrs: attrs
                    }}
                    prop={prop}
                    v-model={_this.query[prop]}
                    label={label}
                    style={{
                        display: 'inline-block',
                        width: width
                    }}
                    emptyAutoSearch={emptyAutoSearch}
                    placeholder={placeholder}
                    clearable={clearable}
                >
                </multi-input>
            );
        },
        renderSelect({
            width = WIDTH,
            placeholder = '请选择',
            multiple = false,
            clearable = true,
            labelKey = 'label',
            valueKey = 'value',
            ...attrs
        }) {
            const _this = this.$parent.pageParent;
            const prop = $g(this.prop);
            const label = $g(this.label);

            // options = optionsKey ? this.recursiveGetProp(_this, optionsKey) : options;
            if (multiple) {
                const selectTreeProps = {
                    disabled: 'disabled',
                    isLeaf: 'isLeaf',
                    label: labelKey,
                    children: 'children',
                };
                return (
                    <md-select-tree
                        popper-class="md-multiple-select--dropdown"
                        {...{
                            props: attrs,
                            attrs: attrs
                        }}
                        prop={prop}
                        v-model={_this.query[prop]}
                        treeData={this.optionDatas || []}
                        multiple
                        hasConfirm
                        clearable={clearable}
                        node-key={valueKey}
                        style={{
                            width: width
                        }}
                        label={label}
                        selectTreeProps={selectTreeProps}
                        placeholder={placeholder}
                    />
                );
            }
            return (
                <el-select
                    {...{
                        props: attrs,
                        attrs: attrs
                    }}
                    prop={prop}
                    v-model={_this.query[prop]}
                    label={label}
                    style={{
                        width: width
                    }}
                    multiple={multiple}
                    placeholder={placeholder}
                    clearable={clearable}
                >
                    {this?.optionDatas?.map(item => (
                        <el-option
                            key={item[valueKey]}
                            label={item[labelKey]}
                            value={item[valueKey]}
                        ></el-option>
                    ))}
                </el-select>
            );
        },
        renderCascader({
            width = WIDTH,
            placeholder = '请选择',
            props,
            clearable = true,
            ...attrs
        }) {
            const _this = this.$parent.pageParent;
            const prop = $g(this.prop);
            const label = $g(this.label);
            // options = optionsKey ? this.recursiveGetProp(_this, optionsKey) : options;
            delete attrs['options'];
            return (
                <el-cascader
                    {...{
                        props: attrs,
                        attrs: attrs
                    }}
                    prop={prop}
                    v-model={_this.query[prop]}
                    label={label}
                    style={{
                        width: width
                    }}
                    placeholder={placeholder}
                    options={this?.optionDatas}
                    props={{ props }}
                    clearable={clearable}
                >
                </el-cascader>
            );
        },
        renderInputNumber({ width = WIDTH, clearable = true, attrType = '', ...attrs }) {
            const _this = this.$parent.pageParent;
            const prop = $g(this.prop);
            const { options } = attrs;
            const label = isEmpty(options)
                ? $g(this.label)
                : undefined;
            return (
                <select-input-number
                    {...{
                        props: attrs,
                        attrs: attrs
                    }}
                    prop={prop}
                    v-model={_this.query[prop]}
                    style={{
                        width: width
                    }}
                    type={attrType}
                    size="small"
                    label={label}
                    clearable={clearable}
                >
                </select-input-number>
            );
        },
        renderTimePicker({ width = WIDTH, placeholder = '请选择时间', clearable = true, ...attrs }) {
            const _this = this.$parent.pageParent;
            const prop = $g(this.prop);
            const label = $g(this.label);
            return (
                <el-time-picker
                    {...{
                        props: attrs,
                        attrs: attrs
                    }}
                    prop={prop}
                    v-model={_this.query[prop]}
                    label={label}
                    style={{ width: width }}
                    clearable={clearable}
                    placeholder={placeholder}
                >
                </el-time-picker>
            );
        },
        renderTimeSelect({ width = WIDTH, placeholder = '请选择时间', clearable = true, ...attrs }) {
            const _this = this.$parent.pageParent;
            const prop = $g(this.prop);
            const label = $g(this.label);
            return (
                <el-time-select
                    {...{
                        props: attrs,
                        attrs: attrs
                    }}
                    prop={prop}
                    v-model={_this.query[prop]}
                    label={label}
                    style={{ width: width }}
                    clearable={clearable}
                    placeholder={placeholder}
                >
                </el-time-select>
            );
        },
        renderDatePicker({ placeholder = '请选择日期', clearable = true, attrType = 'date', ...attrs }) {
            const _this = this.$parent.pageParent;
            const prop = $g(this.prop);
            const label = $g(this.label);

            // 日期范围时指定默认值
            if (attrType === 'daterange' || attrType === 'datetimerange') {
                const {
                    rangeSeparator = '至',
                    startPlaceholder = '开始日期',
                    endPlaceholder = '结束日期',
                    defaultTime = ['00:00:00', '23:59:59'],
                    valueFormat = 'timestamp',
                } = attrs;

                Object.assign(attrs, {
                    rangeSeparator,
                    startPlaceholder,
                    endPlaceholder,
                    defaultTime,
                    valueFormat
                });

                // 暂不支持外部属性配置宽度
                // if (width === WIDTH) {
                // width = attrType === 'daterange' ? '280px' : '380px';
                // }
            }
            return (
                <date-picker
                    {...{
                        props: attrs,
                        attrs: attrs
                    }}
                    prop={prop}
                    v-model={_this.query[prop]}
                    type={attrType}
                    label={label}
                    clearable={clearable}
                    placeholder={placeholder}
                >
                </date-picker>
            );
        },
        renderSelectInput({
            width = '340px',
            placeholder = '请输入',
            emptyAutoSearch = true,
            clearable = true,
            ...attrs
        }) {
            const _this = this.$parent.pageParent;
            const prop = $g(this.prop);

            return (
                <select-input
                    {...{
                        props: attrs,
                        attrs: attrs
                    }}
                    prop={prop}
                    hasConfirmBtn={false}
                    v-model={_this.query[prop]}
                    style={{ width: width }}
                    placeholder={placeholder}
                    options={this?.optionDatas}
                    emptyAutoSearch={emptyAutoSearch}
                    clearable={clearable}
                >
                </select-input>
            );
        },
        renderAutocomplete({ width = WIDTH, placeholder = '请输入', clearable = true, ...attrs }) {
            const _this = this.$parent.pageParent;
            const prop = $g(this.prop);
            const label = $g(this.label);
            return (
                <el-autocomplete
                    {...{
                        props: attrs,
                        attrs: attrs
                    }}
                    prop={prop}
                    v-model={_this.query[prop]}
                    label={label}
                    style={{ width }}
                    placeholder={placeholder}
                    clearable={clearable}
                >
                </el-autocomplete>
            );
        },
        // 解决 'this.['query.name']' 获取不到值问题
        // recursiveGetProp(obj, prop) {
        //     let value;
        //     if (prop.indexOf('.') !== -1) {
        //         prop.split('.').reduce((objVal, curProp) => value = objVal?.[curProp], obj);
        //     } else {
        //         value = obj[prop];
        //     }
        //     return value;
        // }
    },
    render(h) {
        let render;
        if (typeof this.render === 'object') {
            render = this.autoRenderFormat(this.render);
        } else {
            render = this.render;
        }

        const renderResult = render.call(this, h, {
            ...Object.assign({}, this.extraOpts)
        });

        if (!VNode) {
            VNode = this.$createElement('span', '').constructor;
        }

        // render 正常返回 VNode （自行 render)
        if (renderResult instanceof VNode) {
            return renderResult;
        }

        // render 返回响应式数据对象
        render = this.autoRenderFormat(renderResult);
        return render.call(this, h, {
            ...Object.assign({}, this.extraOpts)
        });
    },
};
