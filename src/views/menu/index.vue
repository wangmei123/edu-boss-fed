<template>
  <div class='menu'>
    <el-card class='box-card'>
      <div slot='header' class='clearfix'>
        <el-button @click="$router.push({ name: 'menu-create' })"
          >添加菜单</el-button
        >
      </div>
      <!-- 菜单列表展示区域 -->
      <el-table
        :data="meuns"
        style="width: 100%">
        <!-- 编号通过组件提供的type="index"设置 -->
        <el-table-column
          type="index"
          label="编号">
        </el-table-column>
        <el-table-column
          prop="name"
          label="菜单名称">
        </el-table-column>
        <el-table-column
          prop="level"
          label="菜单级数">
        </el-table-column>
        <el-table-column
          prop="icon"
          label="前端图标">
        </el-table-column>
        <el-table-column
          prop="orderNum"
          label="排序">
        </el-table-column>
        <el-table-column
          label="操作"
          width="150">
          <!-- 作用域插槽 $index是索引 row代表当前行信息（数据） -->
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getAllMenu, deleteMenu } from '@/services/menu'

export default {
  name: 'MenuIndex',
  data () {
    return {
      meuns: []
    }
  },
  created () {
    this.loadMenuAll()
  },
  methods: {
    handleEdit (index, row) {
      // 设置跳转
      this.$router.push({
        name: 'menu-edit',
        params: {
          id: row.id
        }
      })
    },
    handleDelete (index, row) {
      // console.log(index, row)
      // 删除的确认提示
      this.$confirm('确认删除吗？', '删除提示')
        .then(async () => {
          // 发送删除请求
          const { data } = await deleteMenu(row.id)
          // console.log('data', data)
          if (data.code === '000000') {
            this.$message.success('删除成功')
            // 更新数据列表
            this.loadMenuAll()
          }
        })
        .catch(() => {
          // 取消提示
          this.$message.info('已取消删除')
        })
    },
    // 获取所有菜单
    async loadMenuAll () {
      const { data } = await getAllMenu()
      // console.log('data', data)
      if (data.code === '000000') {
        this.meuns = data.data
      }
    }
  }
}
</script>

<style lang='scss' scoped></style>
