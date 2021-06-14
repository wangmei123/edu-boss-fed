<template>
  <div class="app-header">
    <!-- 左侧面包屑部分 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">活动管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 右侧用户信息 -->
    <el-dropdown>
      <span class="el-dropdown-link">
        <el-avatar
          :size="30"
          :src="userInfo.portrait || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
        ></el-avatar>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>{{ userInfo.userName }}</el-dropdown-item>
        <!-- 首先给按钮设置点击事件没有生效，是因为这里的退出按钮为组件，组件设置的都是自定义事件，可以使用事件修饰符.native监听组件根元素的原生事件 -->
        <el-dropdown-item
          divided
          @click.native="handleLogout"
        >退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
// 引入用户信息接口
import { getUserInfo } from '@/services/user'

export default {
  name: 'AppHeader',
  created () {
    // 加载用户信息 不建议在created钩子函数中直接书写逻辑，应该撞到methods中
    this.loadUserInfo()
  },
  data () {
    // 用户信息
    return {
      // 声明存储用户信息的数据，绑定到视图中
      userInfo: {}
    }
  },
  methods: {
    // 加载用户信息功能
    async loadUserInfo () {
      const { data } = await getUserInfo()
      this.userInfo = data.content
    },
    handleLogout () {
      this.$confirm('确认退出吗？', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 1. 清除 store 中的用户的信息
        this.$store.commit('setUser', null)
        // 2. 跳转登录页
        this.$router.push('/login')
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-header {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between; // 内部子项在flex布局中左右两侧布局
}
</style>
