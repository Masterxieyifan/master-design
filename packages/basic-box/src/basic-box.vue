<template>
<div class="basic-box--wrapper dpf-column" :class="_class">
    <slot></slot>
</div>
</template>
<script>
export default {
    name: 'MdBasicBox',
    props: {
        padding: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        _class() {
            if (this.padding) {
                return 'padding';
            }
            return '';
        }
    },
};
</script>
