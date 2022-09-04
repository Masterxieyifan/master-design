const path = require('path');
const isProd = process.env.NODE_ENV === 'production';
// const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    productionSourceMap: false,
    lintOnSave: isProd,
    // 修改 pages 入口
    pages: {
        index: {
            entry: 'examples/main.js', // 入口
            template: 'public/index.html', // 模板
            filename: 'index.html' // 输出文件
        }
    },
    // 扩展 webpack 配置
    chainWebpack: config => {
        // @ 默认指向 src 目录，这里要改成 examples
        // 另外也可以新增一个 ~ 指向 packages
        config.resolve.alias
            .set('@', path.resolve('./'))
            .set('master-design', path.resolve('/index.js'));

        // 把 packages 和 examples 加入编译，因为新增的文件默认是不被 webpack 处理的
        config.module
            .rule('js')
            .include.add(/examples/).end()
            .use('babel')
            .loader('babel-loader')
            .tap(options => options);

        config.module
            .rule('js')
            .include.add(/mixins/).end()
            .use('babel')
            .loader('babel-loader')
            .tap(options => options);

        config.module
            .rule('js')
            .include.add(/package/).end()
            .use('babel')
            .loader('babel-loader')
            .tap(options => options);

        config.module
            .rule('md')
            .test(/\.md$/)
            .use('vue-loader')
            .loader('vue-loader')
            .options({
                compilerOptions: {
                    preserveWhitespace: false
                }
            })
            .end()
            .use(path.resolve(__dirname, './md-loader/index.js'))
            .loader(path.resolve(__dirname, './md-loader/index.js'))
            .end();

        if (process.env.npm_lifecycle_event.indexOf('build') === 0) {
            config.set('externals', {
                '@master_vantop/vantop-util': {
                    root: 'VantopUtil',
                    commonjs: '@master_vantop/vantop-util',
                    commonjs2: '@master_vantop/vantop-util',
                    amd: '@master_vantop/vantop-util'
                },
                '@master_vantop/nextop-http': {
                    root: 'NextopHttp',
                    commonjs: '@master_vantop/nextop-http',
                    commonjs2: '@master_vantop/nextop-http',
                    amd: '@master_vantop/nextop-http'
                },
                '@master_vantop/nextop-core': {
                    root: 'NextopCore',
                    commonjs: '@master_vantop/nextop-core',
                    commonjs2: '@master_vantop/nextop-core',
                    amd: '@master_vantop/nextop-core'
                },
                'element-ui': {
                    root: 'ELEMENT',
                    commonjs: 'element-ui',
                    commonjs2: 'element-ui',
                    amd: 'element-ui'
                },
                'echarts': {
                    root: 'echarts',
                    commonjs: 'echarts',
                    commonjs2: 'echarts',
                    amd: 'echarts'
                },
                'axios': {
                    root: 'axios',
                    commonjs: 'axios',
                    commonjs2: 'axios',
                    amd: 'axios'
                },
            });
        }
    },
    // configureWebpack: {
    //     plugins: [
    //         new VueLoaderPlugin()
    //     ]
    // }
};
