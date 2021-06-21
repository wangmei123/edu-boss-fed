<template>
  <div class="alloc-menu">
      <!-- 角色id为：{{ $route.params.roleId}} -->
      <!-- 角色id为：{{ roleId}} -->
      <el-card>
        <el-tree
          ref="menu-tree"
          node-key="id"
          :data="menus"
          :props="defaultProps"
          show-checkbox
          default-expand-all
          :default-checked-keys="checkedKeys"
          ></el-tree>
          <div style="margin: 20px">
            <el-button @click="onReset">清空</el-button>
            <el-button
              type="primary"
              @click="onSave">保存</el-button>
          </div>
      </el-card>
  </div>
</template>

<script>
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/services/menu'

export default {
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [Number, String],
      required: true
    }
  },
  created () {
    // 加载所有的菜单信息（用于展示 tree 结构）
    this.loadMenus()
    // 加载当前角色已经分配的菜单信息
    this.loadRoleMenus()
  },
  data () {
    return {
      menus: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      checkedKeys: []
    }
  },
  methods: {
    async loadMenus () {
      const { data } = await getMenuNodeList()
      // console.log('data', data)
      if (data.code === '000000') {
        this.menus = data.data
      }
    },
    onReset () {
      this.$refs['menu-tree'].setCheckedKeys([])
    },
    async onSave () {
      // console.log(this.$refs['menu-tree'].getCheckedNodes()) // 对象
      // console.log(this.$refs['menu-tree'].getCheckedKeys()) // [undefined, undefined, undefined] 获取节点的某个属性通过node-key属性指定需要的节点
      const { data } = await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList: this.$refs['menu-tree'].getCheckedKeys()
      })
      // console.log('data', data)
      if (data.code === '000000') {
        this.$message.success('分配菜单成功')
        this.$router.push({
          name: 'role'
        })
      }
    },
    getCheckedKeys (menus) {
      // 遍历数据（将所有存在子节点的 node 排除，对子节点列表进行遍历）
      menus.forEach(menu => {
        // 未选中，结束
        if (!menu.selected) {
          return
        }
        // 检测是否存在子节点
        if (menu.subMenuLis) {
          // 对子节点进行选中状态检测。结束
          return this.getCheckedKeys(menu.subMenuList)
        }
        // 说明为选中的叶子节点（不存在子节点的节点），将Id存储
        // this.checkedKeys.push(menu.id)  // 数据变化次数太多，可能会导致视图频繁刷新，但是变化是异步的，data中的数据是状态驱动，数据每次发生改变都会刷新视图
        this.checkedKeys = [...this.checkedKeys, menu.id] // 此方法每次设置的时候都是最新的，不会存在异步的情况
      })
    },
    async loadRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)
      // console.log('data', data)
      this.getCheckedKeys(data.data)
    }
  }
}
</script>

<style>

</style>
