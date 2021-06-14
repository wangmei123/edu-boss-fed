import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// store/index.js

// export default new Vuex.Store({
//   state: {
//     user: 100
//   },
//   mutations: {
//     setUser (state, payload) {
//       state.user = payload
//     }
//   },
//   actions: {
//     addAction (context) {
//       setTimeout(function () {
//         context.commit('setUser')
//       }, 1000)
//     }
//   },
//   modules: {
//   }
// })

export default new Vuex.Store({
  state: {
    // 用于登录成功后保存用户信息,初始值尝试读取本地存储
    // user: null
    user: JSON.parse(window.localStorage.getItem('user') || null)
  },
  mutations: {
    setUser (state, payload) {
      // 将 payload 转换为对象后再进行存储
      state.user = JSON.parse(payload)
      // 将 payload 数据添加到本地存储中,通过本地存储对user进行数据持久化，但是本地存储只能保存字符串格式
      window.localStorage.setItem('user', payload)
    }
  },
  actions: {
  },
  modules: {
  }
})
