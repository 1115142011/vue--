import axios from 'axios';
import Toast from 'muse-ui-toast';
// import Loading from 'muse-ui-loading'

const env = process.env.NODE_ENV;
let baseURL;
if (env === 'development') {
  baseURL = '/api';
} else {
  baseURL = '';
}

// 创建axios实例
const service = axios.create({
  // baseURL:'/pompapi/v1', // api的base_url
  baseURL: baseURL // api的base_url
  // timeout: 5000 // 请求超时时间
});


// request拦截器
service.interceptors.request.use(config => {
  let token = localStorage.getItem('repaisToken') || '';
  // config.headers.Authorization = `Bearer ${'7d04f7dd07914179a32d84f13b5f813c'}`;
  config.headers.Authorization = `Bearer ${token}`;
  config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
  return config;
}, error => {
  return Promise.reject(error);
});

// respone拦截器
service.interceptors.response.use(
  response => {
    const status = response.status;
    // 请求成功 20X都是进入这里
    if (status === 200) {
      return Promise.resolve({
        code: 200,
        msg: '请求成功',
        data: response.data
      });
    } else if (status === 204) {
      return Promise.resolve({
        code: 200,
        msg: '请求成功',
        data: response.data
      });
    }
  },
  error => {
    let responeData = {};
    responeData.code = error.response.status;
    responeData.msg = '请求错误';
    // 提示消息
    if (error.response) {
      let {
        data
      } = error.response;
      if (data.errorMsg) {
        // 错误消息
        responeData.msg = data.errorMsg;
      }
    }
    if (responeData.msg === '账号不存在') {
    } else {
      Toast.error(responeData.msg);
    }
    return Promise.reject(error.response);
  }
);

export default service
;
