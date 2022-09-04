<template>
<div class="advanced-filter--wrapper">
    <el-popover
        placement="bottom-start"
        :popper-class="_popoverClass"
        v-model="popoverVisible"
        v-on="$listeners"
        v-bind="$attrs"
        trigger="manual"
    >
        <div class="content--box" @keydown.enter="handleEnter">
            <slot></slot>
        </div>
        <slot name="footer" v-if="footer">
            <div class="advanced-filter-footer--wrapper">
                <el-button size="small" type="primary" v-text="'搜索'" @click="handleSearch"></el-button>
                <el-button size="small" plain v-text="'重置'" @click="handleReset"></el-button>
            </div>
        </slot>
        <div slot="reference" >
            <div class="dpf">
                <el-button icon="md-icon-filter-16" @click.native.stop="handleTriggerClick" type="info">{{computedTriggerText}}</el-button>
                <div v-if="this.searchConditionNum" class="reset-btn" @click="handleReset">重置</div>
            </div>
        </div>
    </el-popover>
</div>
</template>
<script>

export default {
    name: 'MdAdvancedFilter',
    props: {
        triggerText: {
            type: String,
            default: '高级搜索',
        },
        footer: {
            type: Boolean,
            default: true,
        },
        popoverClass: {
            type: String,
        },
        searchConditionNum: {
            type: Number,
            default: 0,
        },
    },
    computed: {
        computedTriggerText() {
            if (this.searchConditionNum) {
                return `已选择${this.searchConditionNum}个条件`;
            }
            return this.triggerText;
        },
        _popoverClass() {
            const arr = [
                'advanced-filter-popover--wrapper',
            ];
            if (this.popoverClass) arr.push(this.popoverClass);
            return arr.join(' ');
        }
    },
    data() {
        return {
            popoverVisible: false,
            __documentListener: null, // eslint-disable-line vue/no-reserved-keys
        };
    },
    watch: {
        popoverVisible(val) {
            if (val) {
                this.__mountedBodyClickListener();
            } else {
                this.__clearBodyClickListener();
            }
        }
    },
    methods: {
        handleEnter() {
            this.$emit('search');
        },
        __mountedBodyClickListener() {
            this.__documentListener = document.addEventListener('click', () => {
                this.__hidePopover();
            });
        },
        __clearBodyClickListener() {
            this.__documentListener && document.removeEventListener(this.__documentListener);
        },
        handleSearch() {
            this.__hidePopover();
            this.$emit('search');
        },
        handleTriggerClick() {
            this.popoverVisible = !this.popoverVisible;
            this.$emit('trigger');
        },
        handleReset() {
            this.$emit('reset');
        },
        __hidePopover() {
            this.popoverVisible = false; // hide popover
        }
    },
    beforeDestroy() {
        this.__clearBodyClickListener();
    }
};
</script>
