<template>
  <div class="role-list">
      <el-card>
        <div class="clearfix" slot="header">
            <el-form
            :inline="true"
            :model="form"
            class="demo-form-inline"
            ref="form"
          >
            <el-form-item label="输入搜索" prop="name">
              <el-input
                v-model="form.name"
                placeholder="角色名称"
                clearable
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <!-- 显示对话框 -->
        <el-button @click="handleAdd">添加角色</el-button>
        <el-table
        :data="roles"
        style="width: 100%"
        v-loading="isLoading">
          <el-table-column
              prop="id"
              label="编号"
              width="100"
          >
          </el-table-column>
          <el-table-column
              prop="name"
              label="角色名称"
          >
          </el-table-column>
          <el-table-column
              prop="description"
              label="描述">
          </el-table-column>
          <!-- 设置过滤器需要使用作用域插槽获取数据 -->
          <el-table-column
              label="添加时间">
              <template slot-scope="scope">
                <span>{{ scope.row.createdTime | dateFormat }}</span>
              </template>
          </el-table-column>
          <el-table-column
              label="操作">
              <template slot-scope="scope">
                  <el-button
                  size="mini"
                  @click="handleEdit(scope.row)"
                  >分配菜单</el-button>
                  <el-button
                  size="mini"
                  @click="handleEdit(scope.row)"
                  >分配资源</el-button>
                  <el-button
                  size="mini"
                  @click="handleEdit(scope.row)"
                  >编辑</el-button>
                  <el-button
                  size="mini"
                  @click="handleDelete(scope.row)"
                  type="danger"
                  >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
     </el-card>
  </div>
</template>

<script>
import { getRoles } from '@/services/role'

export default {
  name: 'RoleList',
  data () {
    return {
      form: {
        name: ''
      },
      roles: [],
      isLoading: false
    }
  },
  created () {
    this.loadRoles()
  },
  methods: {
    handleAdd () {

    },
    handleEdit () {

    },
    handleDelete () {

    },
    async loadRoles () {
      this.isLoading = true
      const { data } = await getRoles(this.form)
      //   console.log('data', data)
      if (data.code === '000000') {
        this.roles = data.data.records
      }
      this.isLoading = false
    }
  },
  filters: {
    // 日期过滤器
    dateFormat (date) {
      date = new Date(date)
      return `
        ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 
        ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
      `
    }
  }
}
</script>

<style>

</style>
