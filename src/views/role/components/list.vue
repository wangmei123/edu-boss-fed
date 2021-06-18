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
            <el-form-item>
              <el-button
                type="primary"
                @click="onSubmit"
                v-loading="isLoading"
              >查询搜索</el-button>
              <el-button @click="onReset">重置</el-button>
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
              align="center"
          >
          </el-table-column>
          <el-table-column
              prop="description"
              label="描述"
              align="center">
          </el-table-column>
          <!-- 设置过滤器需要使用作用域插槽获取数据 -->
          <el-table-column
              label="添加时间"
              align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.createdTime | dateFormat }}</span>
              </template>
          </el-table-column>
          <el-table-column
              label="操作"
              align="center">
              <template slot-scope="scope">
                <div>
                  <el-button
                    type="text"
                    @click="$router.push({
                      name: 'alloc-menu',
                      params: {
                        roleId: scope.row.id
                      }
                    })"
                  >分配菜单</el-button>
                  <el-button
                    type="text"
                  >分配资源</el-button>
                </div>
                <div>
                  <el-button
                    type="text"
                    @click="handleEdit(scope.row)"
                  >编辑</el-button>
                  <el-button
                    type="text"
                    @click="handleDelete(scope.row)"
                  >删除</el-button>
                </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 添加角色的对话框结构 -->
        <!-- v-if的判断是为了将组件在关闭时销毁，不然组件一直存在，组件的生命周期只会执行一次
        当需要重复使用create生命周期函数获取一遍数据时，需要卸载这个组件，而不仅仅是不显示，这样就只会请求一次数据，
        -->
        <el-dialog
          :title="isEdit ? '编辑角色' : '添加角色'"
          :visible.sync="dialogVisible"
          v-if="dialogVisible"
          width="30%"
          >
          <!-- 将添加与编辑功能单独封装到组件中 -->
          <create-or-edit
            :is-edit="isEdit"
            :role-id="roleId"
            @success="handleSuccess"
            @cancel="handleCancel"
          ></create-or-edit>
        </el-dialog>
     </el-card>
  </div>
</template>

<script>
import CreateOrEdit from './CreateOrEdit'
import { getRoles, deleteRole } from '@/services/role'

export default {
  name: 'RoleList',
  components: {
    CreateOrEdit
  },
  data () {
    return {
      form: {
        name: ''
      },
      roles: [],
      isLoading: false,
      // 控制对话框显示
      dialogVisible: false,
      // 控制对话框的功能状态
      isEdit: false,
      // 存储正在编辑的角色 ID
      roleId: ''
    }
  },
  created () {
    this.loadRoles()
  },
  methods: {
    onReset () {},
    onSubmit () {},
    // 添加菜单
    handleAdd () {
      this.dialogVisible = true
      this.isEdit = false
    },
    // 编辑菜单
    handleEdit (role) {
      this.dialogVisible = true
      this.isEdit = true
      this.roleId = role.id
    },
    // 监听子组件的添加状态，成功时触发
    handleSuccess () {
      // 隐藏对话框
      this.dialogVisible = false
      // 刷新列表
      this.loadRoles()
    },
    // 监听子组件取消状态
    handleCancel () {
      this.dialogVisible = false
    },
    // 删除角色
    handleDelete (role) {
      this.$confirm(`确认删除角色：${role.name}？`, '删除提示')
        .then(async () => {
          await deleteRole(role.id)
          this.$message.success('删除成功')
          this.loadRoles()
        })
        .catch(err => {
          if (err && err.response) {
            this.$message.error('删除失败，请重试')
          } else {
            this.$message.info('取消删除')
          }
        })
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
