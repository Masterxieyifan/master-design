import './styles/index.scss';
import VueLazyload from 'vue-lazyload';

function camelCase(name) {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/-(\w)/g, (m, n) => n.toUpperCase());
}

const MasterDesign = {};
const modulesFiles = require.context('./packages', true, /^.\/[a-z-]+\/index.js$/);
const components = modulesFiles.keys().reduce((modules, modulePath) => {
    const fileKey = camelCase(modulePath.split('/')[1]);
    const module = modulesFiles(modulePath).default;
    MasterDesign[fileKey] = module;
    modules.push(module);
    return modules;
}, []);

const directiveFiles = require.context('./directives', true, /^.\/[a-z-]+\/index.js$/);
const directives = directiveFiles.keys().reduce((modules, modulePath) => {
    const module = directiveFiles(modulePath).default;
    modules.push(module);
    return modules;
}, []);

// 默认安装
function install(Vue) {
    components.map(component => Vue.component(component.name, component));
    directives.map(directive => Vue.directive(directive.name, directive));

    Vue.use(VueLazyload, {
        adapter: {
            error(listender) {
                const event = new Event('error');
                listender.el.dispatchEvent(event);
            }
        }
    });
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
    window.MasterDesign = MasterDesign;
}

export default {
    install,
    ...MasterDesign
};



// export default VantopUILib;

// if (typeof window !== 'undefined' && window.Vue && window.Vue.use) {
//     window.Vue.use(VantopUILib);
//     window.VantopUI = VantopUILib;
// }