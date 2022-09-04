<template>
    <div
        class="md-custom-target-group custom-target-group"
        v-sortable
    >
        <div
            v-for="{key,children} in checkedTargets"
            :key="key"
            :data-id="key"
        >
            <ul
                class="custom-target-group-item-title"
                style="padding:0"
                @mouseleave="customTarget.handleMouseLeave"
                @click="changeState(key)"
            >
                <div class="title-name">

                    <i :class="{
                        'nt-icon-down-fill-16':!itemState[key],
                        'nt-icon-right-fill-16': itemState[key],
                    }"></i>
                    {{nameMap[key]}}
                </div>

                <el-button
                    @click="handleDel(children,key)"
                    type="text"
                >删除</el-button>
            </ul>
            <ul
                style="padding:0"
                v-sortable="key"
                v-show="!itemState[key]"
            >
                <li
                    class="custom-target--selected"
                    v-for="id in children"
                    :key="id"
                    :data-id="id"
                >
                    <span
                        class="custom-target--selected__label"
                        @mousemove="customTarget.handleMouseMove((valueMap[id] && valueMap[id][labelKey]) || id)"
                        @mouseleave="customTarget.handleMouseLeave"
                    >{{(valueMap[id] && valueMap[id][labelKey]) || id}}</span>
                    <span>
                        <i
                            class="nt-icon-close-16"
                            @click="handleDel([id],key)"
                        />
                        <i class="nt-icon-drag-16" />
                    </span>
                </li>
            </ul>
        </div>

    </div>
</template>

<script>
import Sortable from 'sortablejs';
export default {
    name: 'MdCustomTargetGroup',
    inject: ['customTarget'],
    directives: {
        // 指令的定义
        sortable: {
            bind(el, binding, vNode) {
                const options = {
                    animation: 250,
                    onEnd: () => {
                        vNode.context.setDragData(binding.value, sortable.toArray());
                    },
                };
                let sortable = Sortable.create(el, options);
            },
        },
    },
    props: {
        // 分组的选择结果
        checkedList: {
            type: Array,
            default: () => [],
        },
    },
    computed: {
        valueKey() {
            return this.customTarget.valueKey;
        },
        titleKey() {
            return this.customTarget.titleKey;
        },
        labelKey() {
            return this.customTarget.labelKey;
        },
        nameMap() {
            let nameMap = {};
            this.customTarget.data.forEach((element) => {
                nameMap[element[this.valueKey]] = element[this.titleKey];
            });
            return nameMap;
        },
    },
    watch: {
        checkedList: {
            immediate: true,
            handler(val) {
                this.checkedTargets = val;
                let data = [];
                for (const item of val) {
                    data = [...data, ...item.children];
                }
                this.customTarget.$emit('input', data);
            },
            deep: true,
        },
        checkedTargets: {
            handler(v) {
                this.$emit('update:checkedList', v);
            },
            deep: true,
        },
    },
    data() {
        return {
            valueMap: this.customTarget.valueMap,
            checkedTargets: [],
            itemState: {},
        };
    },
    methods: {
        changeState(key) {
            this.$set(this.itemState, key, !this.itemState[key]);
        },
        setDragData(key, data) {
            if (key) {
                const itemIndex = this.checkedTargets.findIndex((item) => item.key === key);
                this.$set(this.checkedTargets, itemIndex, {
                    key: key,
                    children: data,
                });
            } else {
                const checkedTargets = data.map((item) => this.checkedTargets.find((checked) => checked.key === item));
                this.checkedTargets = checkedTargets;
                this.checkedTargets.splice();
            }
        },
        select(id, key) {
            const itemIndex = this.checkedTargets.findIndex((item) => item.key === key);
            if (itemIndex === -1) {
                let checkedTargets = [...this.checkedTargets];
                checkedTargets.push({
                    key: key,
                    children: [id],
                });
                this.checkedTargets.length = 0;
                for (const element of this.customTarget.data) {
                    const data = checkedTargets.find(item=>item.key === element[this.valueKey]);
                    data && this.checkedTargets.push(data);
                }
                return;
            }

            const index = this.checkedTargets[itemIndex].children.indexOf(id);
            if (index === -1) {
                return this.checkedTargets[itemIndex].children.push(id);
            }
            if (this.checkedTargets[itemIndex].children.length === 1) {
                return this.checkedTargets.splice(itemIndex, 1);
            }
            this.checkedTargets[itemIndex].children.splice(index, 1);
        },
        handleDel(ids, key) {
            for (const id of ids) {
                this.customTarget.select(id, key);
            }
        },
    },
};
</script>
