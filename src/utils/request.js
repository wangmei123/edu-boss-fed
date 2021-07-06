import axios from 'axios'
// 引入store
import store from '@/store'
// 通过局部引入方式引入 Element 的 Message 组件功能
import { Message } from 'element-ui'
// 引入 router
import router from '@/router'
// 引入 qs 用于进行请求参数处理
import qs from 'qs'

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
  const {
    user
  } = store.state
  if (user && user.access_token) {
    // 统一设置Token
    config.headers.Authorization = user.access_token
  }
  return config
})

// 封装跳转登录页函数
function redirectLogin () {
  // 跳转到登录页
  router.push({
    name: 'login',
    query: {
      // currentRoute 就是存储了路由信息的对象
      redirect: router.currentRoute.fullPath
    }
  })
}
// 存储是否正在更新 Token 的状态  多个请求重复刷新token处理
let isRefreshing = false
// 存储因为等待 Token 刷新而挂起的请求
let requests = []

// Add a response interceptor  响应拦截器
axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger 状态码 2xx 会执行这里
  // Do something with response data
  return response
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger 超出2XX都会进入这里
  // console.dir(error)
  if (error.response) {
    // The request was made and the server responded with a status code 请求发送成功，响应接收完毕，但状态码为失败的情况
    // that falls out of the range of 2xx
    // 1、判断失败的状态码情况（主要处理 401 的情况）
    // 1. 保存状态码
    const { status } = error.response
    // 2. 判断
    let errorMessage = ''
    if (status === 400) {
      errorMessage = '请求参数错误'
    } else if (status === 401) {
      // token 无效
      // 1、无Token信息
      if (!store.state.user) {
        // 1、如果有，则将当前请求挂起，等token刷新完毕后再重发
        redirectLogin()
        // 阻止后续操作，向下抛出错误对象
        return Promise.reject(error)
      }
      // 检测是否已经存在了正在刷新 Token 的请求
      if (isRefreshing) {
        // 将当前失败的请求，存储到请求列表中
        return requests.push(() => {
          // 当前函数调用后，会自动发送本次失败的请求
          request(error.config)
        })
      }
      // 2、如果没有，则更新isRefreshing并发送请求，继续执行后续操作
      isRefreshing = true
      // 2、Token无效（错误Token,过期 Token）请求刷新Token接口,获取新的access_token
      return request({
        method: 'POST',
        url: '/front/user/refresh_token',
        data: qs.stringify({
          refreshtoken: store.state.user.refresh_token
        })
      }).then(res => {
        // console.log(res)
        // 刷新token失败
        if (res.data.state !== 1) {
          // 清除无效的用户信息
          store.commit('setUser', null)
          // 跳转到登录页
          redirectLogin()
          return Promise.reject(error)
        }
        // 刷新token成功
        // 存储新的token
        store.commit('setUser', res.data.content)
        // 重新发送之前失败的请求（根据 requests 发送所有失败的请求）error.config是本次失败的请求的配置对象
        requests.forEach(callback => callback())
        //  - 发送完毕，清除 requests 内容即可
        requests = []
        //  - 将本次请求发送
        return request(error.config)
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        // 3、请求发送完毕，响应处理完毕，将刷新状态更改为 false 即可
        isRefreshing = false
      })
    } else if (status === 403) {
      errorMessage = '没有权限，请联系管理员'
    } else if (status === 404) {
      errorMessage = '请求资源不存在'
    } else if (status >= 500) {
      errorMessage = '服务端错误，请联系管理员'
    }
    Message.error(errorMessage)
  } else if (error.request) {
    // The request was made but no response was received 请求发送成功，但是未收到响应
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    Message.error('请求超时，请重试')
  } else {
    // Something happened in setting up the request that triggered an Error  意料之外的错误
    Message.error(`请求失败${error.message}`)
  }
  // console.log(error.config)
  // Do something with response error 将本次请求的错误对象继续向后抛出，让接收响应的处理函数进行操作
  return Promise.reject(error)
})

export default request
