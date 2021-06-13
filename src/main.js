import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 在入口文件中引入element-ui 是全引入
import ElementUI from 'element-ui'

// 引入主题风格
// import 'element-ui/lib/theme-chalk/index.css'
// 引入自定义的全局样式文件
import './styles/index.scss'

// 将Element注册为Vue插件
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
