<template>
  <div id="app">
    <!-- 根路由出口 -->
    <router-view />
  </div>
</template>

<script>
// import request from '@/utils/request'

// request({
//   method: 'Get',
//   // url: 'http://edufront.lagou.com/front/ad/getAdList'
//   url: 'http://eduboss.lagou.com/boss/v2/api-docs?group=edu-boss-boot'// 每次书写完整的url地址较为繁琐，可以给request设置拦截器判断url前缀，再将对应基地址设置给config.baseURL
// }).then(res => {
//   console.log('res', res)
// })
export default {

}
</script>

<style lang="scss">
// @import '~@/styles/variables.scss';  此处的引用在vue.config.js文件中注册了共享全局样式变量的配置，所以在此处不需要再书写样式文件的引用，修改了配置文件后一定记得重启项目文件
</style>
