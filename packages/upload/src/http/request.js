import axios from 'axios';

import { Message } from 'element-ui';

const token =
    'Bearer ' + JSON.parse(localStorage.getItem('nextop-micro:TOKEN'));

const instance = axios.create({
    baseURL: 'https://api.nextop.cc'
});

instance.defaults.crossDomain = true;
instance.defaults.withCredentials = true;
instance.defaults.headers['Authorization'] = token;
// 头部加入语言参数
instance.defaults.headers['x-ca-language']?.includes('zh') ? 'en_US' : 'zh_CN';
// 加入请求的唯一ID
instance.defaults.headers['x-ca-reqid'] = Math.random() + new Date().getTime();
// 加入请求的时间戳
instance.defaults.headers['x-ca-reqtime'] = new Date().getTime();

// 添加响应拦截器
instance.interceptors.response.use(
    response => {
        const { status } = response;
        const { code, responseCode, success, msg, message } = response.data;
        if (
            status === 200 &&
            (code === '000000' || responseCode === '10000') &&
            success
        ) {
            return Promise.resolve(response.data);
        }
        Message.error(msg || message || '服务器异常');
        return Promise.reject(msg);
    },
    error => {
        const errinfo = error.response.data;
        return Promise.reject(errinfo);
    }
);

export default instance;
