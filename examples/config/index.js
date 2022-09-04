import router from '../router/index.js';

let menuList = router.options.routes.map(({ path, name }) => ({ path,
    name }));

export default {
    menuList
};
