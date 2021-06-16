<template>
  <div class="resource-list">
     <el-card>
        <div class="clearfix" slot="header">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="审批人">
                <el-input v-model="formInline.user" placeholder="审批人"></el-input>
            </el-form-item>
            <el-form-item label="活动区域">
                <el-select v-model="formInline.region" placeholder="活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
            </el-form>
        </div>
        <el-table
        :data="resources"
        style="width: 100%">
        <el-table-column
            prop="id"
            label="编号"
            width="100"
        >
        </el-table-column>
        <el-table-column
            prop="name"
            label="资源名称"
        >
        </el-table-column>
        <el-table-column
            prop="url"
            label="资源路径"
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
import { getResourcePages } from '@/services/resource'
export default {
  name: 'resource-list',
  data () {
    return {
      formInline: {
        user: '',
        region: ''
      },
      resources: []
    }
  },
  created () {
    this.loadResources()
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    async loadResources () {
      const { data } = await getResourcePages({})
      //   console.log('data', data)
      if (data.code === '000000') {
        this.resources = data.data.records
      }
    },
    handleEdit () {

    },
    handleDelete () {

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

<style lang="scss" scoped>

</style>
