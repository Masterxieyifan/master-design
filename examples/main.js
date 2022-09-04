import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './base.scss';
import 'highlight.js/styles/docco.css';
import './assets/styles/common.scss';
import './assets/styles/fonts/style.css';

//VueCompositionAPI
import VueCompositionAPI from '@vue/composition-api';
Vue.use(VueCompositionAPI);

//master-design
import MasterDesign from '../index';
Vue.use(MasterDesign);

//element-ui
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Element);

//demo-block
import demoBlock from './common/demo-block.vue';
Vue.component('demo-block', demoBlock);

// advanced-search-demo
import AdvancedSearchDemo from './common/AdvancedSearchDemo.vue';
Vue.component('advanced-search-demo', AdvancedSearchDemo);

// vxe-table
import 'xe-utils';
import VXETable from 'vxe-table';
import 'vxe-table/lib/style.css';
Vue.use(VXETable);

// example code highlight
import hljs from 'highlight.js';
router.afterEach(route => {
    Vue.nextTick(() => {
        const blocks = document.querySelectorAll('pre code:not(.hljs)');
        Array.prototype.forEach.call(blocks, hljs.highlightBlock);
    });
});

Vue.config.productionTip = false;

Vue.prototype.$api = {
    getTableList: () => {
        return new Promise(resolve => {
            const records = [];
            for (let i = 1; i <= 20; i++) {
                records.push({
                    name: '吴清一' + i,
                    age: i,
                    sex: i % 2 === 0 ? '男' : '女'
                 })
            }
            setTimeout(() => {
                return resolve({
                    records,
                    total: 200
                })
            }, 1500)
        })
    }
}

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');


