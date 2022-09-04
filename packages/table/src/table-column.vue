<script>
import { isEmpty, copyText } from '@master_vantop/vantop-util';
export default {
    name: 'TableColumn',
    props: {
        data: {
            type: Object,
            default:() => ({})
        },
    },
    methods: {
        cellFormatter({ cellValue }) {
            return isEmpty(cellValue) ? '-' : cellValue;
        },
        handleCopy(copiable, val, params) {
            const { row, column, ...rest } = params;
            const text = typeof copiable === 'function'
                ? copiable(row, column, { ...rest })
                : val;
            copyText(text).then(()=>{
                this.$message.success('复制成功');
            }).catch(()=>{
                this.$message.error('复制失败');
            });
        }
    },
    render: function(h) {
        const {
            data,
            cellFormatter,
            handleCopy
        } = this;
        const hasChildren = data.children && data.children.length;
        if (hasChildren) {
            const {
                children,
                prop,
                label,
                ...groupRest
            } = data;
            return (
                <vxe-table-colgroup
                    field={prop}
                    title={label}
                    props={{ ...groupRest }}
                >
                    { children.map(item=><table-column data={item}/>) }
                </vxe-table-colgroup>
            );
        }
        const {
            label,
            prop,
            minWidth,
            width,
            hoverable,
            copiable,
            render,
            renderHeader,
            renderFilter,
            formatter,
            ...rest
        } = data;
        const headerScoped = renderHeader
            ? ({ column, columnIndex, $rowIndex }) => renderHeader.call(this, h, {
                column,
                $rowIndex,
                columnIndex
            })
            : null;
        const filterScoped = renderFilter
            ? ({ column, columnIndex, $panel }) => renderFilter.call(this, h, {
                column,
                columnIndex,
                $panel
            })
            : null;

        const cellScoped = render
            ? ({ row, column, rowIndex, columnIndex }) => render.call(this, h, {
                rowIndex,
                columnIndex,
                column,
                row
            })
            : copiable
                ? ({ row, column, rowIndex, columnIndex }) => (
                    <div class="vxe-cell--copiable">
                        {
                            hoverable ?
                                <md-popover
                                    line={1}
                                    content={row[prop]}>{row[prop]}</md-popover>
                                : row[prop]
                        }
                        <i
                            v-hint="复制"
                            class="md-icon-copy-light-16"
                            onClick={()=>handleCopy(copiable, row[prop], { row,
                                rowIndex,
                                column,
                                columnIndex })}
                        />
                    </div>)
                : null;

        return (
            <vxe-table-column
                field={prop}
                title={label}
                formatter={formatter ? formatter : cellFormatter}
                min-width={minWidth || width}
                width={ width }
                props={{ ...rest }}
                show-overflow={!copiable && hoverable ? 'tooltip' : false}
                render-tooltip={typeof hoverable === 'function' ? hoverable : null}
                scopedSlots={
                    {
                        header: headerScoped,
                        filter: filterScoped,
                        default: cellScoped
                    }
                }
            />
        );
    }
};
</script>
