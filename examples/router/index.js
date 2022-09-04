import Vue from 'vue';
import VueRouter from 'vue-router';
import test from '../views/test.vue';
Vue.use(VueRouter);

function toName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, (m, n) => ` ${n.toUpperCase()}`);
}
function toPath(name) {
    return '/' + name.charAt(0).toLowerCase() + name.slice(1).replace(/([A-Z])/g, (m, n) => `-${n.toLowerCase()}`);
}
const modulesFiles = require.context('../views', true, /^.\/[a-zA-Z]+\.md$/);
const views = modulesFiles.keys().reduce((modules, modulePath) => {
    const name = modulePath.split('/')[1].replace(/\.md$/, '');
    const temp = {
        path: toPath(name),
        name: toName(name),
        component: modulesFiles(modulePath).default
    }
    modules.push(temp);
    return modules;
}, []);

const routes = [
    {
        path: '/',
        redirect: '/table'
    },
    ...views,
    {
        path: '/test',
        component: test,
        name: '组件性能测试'
    },
    {
        path: '*',
        redirect: '/table',
    },
];

const router = new VueRouter({
    mode: 'history',
    routes
});

export default router;
