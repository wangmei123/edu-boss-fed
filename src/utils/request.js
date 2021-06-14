import axios from 'axios'
// 引入store
import store from '@/store'
// axios.create()可以使用自定义配置新建一个axios实例
const request = axios.create({
  // timeout:
  // baseURL:
  // headers:
})

// 封装 URL 基地址检测函数
function getBaseURL (url) {
  if (url.startsWith('/boss')) {
    return 'http://eduboss.lagou.com'
  } else {
    return 'http://edufront.lagou.com'
  }
}

// 设置请求拦截器
request.interceptors.request.use(function (config) {
  // 根据请求的 URL 判断基地址，设置给 config.baseURL
  config.baseURL = getBaseURL(config.url)

  // Token统一处理
  // 为了严谨，可以读取 store中的user后进行Token检测
  const { user } = store.state
  if (user && user.access_token) {
    // 统一设置Token
    config.headers.Authorization = user.access_token
  }
  return config
})

export default request
