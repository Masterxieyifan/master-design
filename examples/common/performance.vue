<template>
    <div class="component-test">
        <div class="test-title">
            <el-button
                type="primary"
                size="mini"
                @click="test"
            >开始测试</el-button>
            <span class="test-avg">十次平均渲染时间:  {{ avgTime }}ms</span>
            <el-tooltip placement="top">
                <div slot="content">
                    <p v-for="(item, index) in renderTime">第{{ index + 1}}渲染时间:  {{ item.duration }}ms</p>
                </div>
                <i class="md-icon-help-16"></i>
            </el-tooltip>
        </div>
        <slot v-if="show"></slot>
</div>
</template>

<script>
import { add, divide } from 'xe-utils';
export default {
    name: 'Performance',
    data() {
        return {
            avgTime: null,
            renderTime: [],
            show: true,
        };
    },
    methods: {
        async test() {
            for (let i = 0; i <21; i++) {
                this.show = !this.show;
                this.show && window.performance.mark('start');
                await this.renderDone();    
                this.show && window.performance.measure('render', 'start', 'end');
            }
            this.renderTime = window.performance.getEntriesByName('render');
            const totalTime = this.renderTime.reduce((a, b) => add(a + b.duration), 0);
            this.avgTime =  divide(totalTime, 10)
            window.performance.clearMarks();
            window.performance.clearMeasures();
            this.show = true;
        },
        renderDone() {
            return new Promise(resolve => {
                setTimeout(() => {
                    this.show && window.performance.mark('end');
                    resolve(null);
                });
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.component-test {
    padding: 20px;
    .test-title {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .el-button {
            margin-right: 10px;
        }
        .test-avg {
            margin-right: 10px;
        }
    }
}
</style>