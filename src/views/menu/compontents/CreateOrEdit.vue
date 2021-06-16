<template>
  <div class="menu-create-or-edit">
    <!-- Card 组件 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 设置标题 -->
        <span>{{ isEdit ? '编辑菜单' : '添加菜单' }}</span>
      </div>
      <!-- Form 组件 -->
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="菜单名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径">
          <el-input v-model="form.href"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-select v-model="form.parentId" placeholder="请选择上级菜单">
            <!-- 无上级菜单 -->
            <el-option
              :value="-1"
              label="无上级菜单"></el-option>
            <!-- 选择一级菜单 -->
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in parentMenuList"
              :key="item.id"></el-option>
            <!-- <el-option label="区域二" value="beijing"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="前端图标">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-radio-group v-model="form.shown">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number
            v-model="form.orderNum"
            label="描述文字"
          ></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button v-if="!isEdit">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getEditMenuInfo, saveOrUpdate } from '@/services/menu'

export default {
  name: 'CreateOrEdit',
  // 通过 props 接收父组件传值，判断当前是哪种功能（添加或编辑）
  props: {
    isEdit: {
      type: Boolean,
      // 默认为添加功能
      default: false
    }
  },
  data () {
    return {
      form: {
        parentId: -1,
        name: '',
        href: '',
        icon: '',
        orderNum: 1,
        description: '',
        shown: true
      },
      parentMenuList: []
    }
  },
  created () {
    // 加载上级菜单信息
    this.loadMenuInfo()
  },
  methods: {
    async onSubmit () {
      // 表单验证
      await this.$refs.form.validate()
      // 发送请求
      const { data } = await saveOrUpdate(this.form)
      // console.log('data', data)
      if (data.code === '000000') {
        this.$message.success('提交成功')
        this.$router.push({ name: 'menu' })
      }
    },
    async loadMenuInfo () {
      // 检测是否存在路由参数id，并进行对应处理
      // 编辑功能合并后，处理接口id，默认值为-1为添加功能使用
      console.log(this.$route.params.id)
      const id = this.$route.params.id || -1
      // 请求上级菜单数据
      const { data } = await getEditMenuInfo(id)
      if (data.data.menuInfo) {
        // 如果存在则更新给form
        this.form = data.data.menuInfo
      }
      // console.log('data', data)
      if (data.code === '000000') {
        this.parentMenuList = data.data.parentMenuList
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
