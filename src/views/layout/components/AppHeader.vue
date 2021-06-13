<template>
  <div class="app-header">
      <!-- 左侧面包屑部分 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 右侧用户信息 -->
      <el-dropdown>
        <span class="el-dropdown-link">
            <el-avatar
              :size="30"
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png">
            </el-avatar>
            <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>用户信息</el-dropdown-item>
            <el-dropdown-item divided>退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'AppHeader'
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
