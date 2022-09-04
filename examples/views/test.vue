<template>
    <performance>
        <md-popover
            v-for="(item) in data"
            :line="1"
            :content="`${item}. Celtics and Warriors are both searching, Celtics and Warriors are both searching, Celtics and Warriors are both searching`"
        >
            {{item}}. Celtics and Warriors are both searching. Celtics and Warriors are bot
        </md-popover>
    </performance>
</template>

<script>
import Performance from '../common/performance.vue';
export default {
    name: 'test',
    components: {
        Performance,
    },
    data() {
        return {
            data: [],
        };
    },
    created() {
        const data = new Array(2000).fill(0).map((_, index) => (index));
        this.data = data;
    }
};
</script>