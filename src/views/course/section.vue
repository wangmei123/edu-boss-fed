<template>
  <div class="course-section">
      <el-card>
        <!-- allow-drop 属性通过回调返回的布尔值来判断当前节点是否能被放置，接收 3 个参数：
        draggingNode 正在拖拽的节点
        dropNode 放置的⽬标节点
        type 放置在⽬标节点的哪个位置 值有三种情况：prev（同级前）、inner（内）、next（同级后） -->
          <el-tree
            v-loading="isLoading"
            :data="sections"
            :props="defaultProps"
            draggable
            :allow-drop="handleAllowDrop"
            @node-drop="handleNodeDrop"
            >
            <div class="inner" slot-scope="{ node, data }">
              <!-- 设置内容 -->
              <span>{{ node.label }}</span>
              <!-- 设置后续按钮结构 -->
              <span v-if="data.sectionName" class="actions">
                <el-button>编辑</el-button>
                <el-button>添加课时</el-button>
                <el-button>状态</el-button>
              </span>
              <span v-else class="actions">
                <el-button>编辑</el-button>
                <el-button
                  type="success"
                  @click="$router.push({
                    name: 'course-video',
                    params: {
                      courseId
                    },
                    query: {
                      lessonId: data.id
                    }
                  })"
                >上传视频</el-button>
                <el-button>状态</el-button>
              </span>
            </div>
          </el-tree>
      </el-card>
  </div>
</template>

<script>
import { getSectionAndLesson, saveOrUpdateSection, saveOrUpdateLesson } from '@/services/course-section.js'

export default {
  name: 'CourseSection',
  props: {
    courseId: {
      type: [Number, String],
      require: true
    }
  },
  data () {
    return {
      sections: [],
      defaultProps: {
        children: 'lessonDTOS',
        // label: 'label'
        label (data) {
          return data.sectionName || data.theme
        }
      },
      isLoading: false
    }
  },
  created () {
    this.loadSection()
  },
  methods: {
    handleAllowDrop (draggingNode, dropNode, type) {
      // 规则1：只能同级移动，type不能为inner
      // 规则2：课时不能移动到其他章节中
      // 1. 不能有放⼊内部的操作，但例如将章节1拖拽到章节2的课时1之前时，type 为 prev，需要进⼀步处理
      // 2. 所有课时都具有 sectionId，通过下⾯的条件，限制章节不能移动到课时前后，也不能将章节的课时移动到其他章节
      return type !== 'inner' && draggingNode.data.sectionId === dropNode.data.sectionId
    },
    async loadSection () {
      const { data } = await getSectionAndLesson(this.courseId)
      //   console.log('data', data)
      if (data.code === '000000') {
        this.sections = data.data
      }
    },
    async handleNodeDrop (draggingNode, dropNode, type, event) {
      // 由于有很多章节和课时，需要对每个章节和课时都要进行最新的排序顺序的请求
      // 1. ⽆论是章节还是课时, dropNode 都有parent(draggingNode.parent 总为 null), 内部有childNodes
      // - dropNode.parent.childNodes 可获取拖拽项所在列表的所有数据
      // - 遍历操作
      this.isLoading = true
      try {
        await Promise.all(dropNode.parent.childNodes.map((item, index) => {
        // 判断
        // - 除了 draggingNode.data.sectionId 外，draggingNode.lessonDTOS 也可以判断
          if (draggingNode.data.sectionId) {
            // 课时
            return saveOrUpdateLesson({
              id: this.courseId,
              orderNum: index
            })
          } else {
            // 章节
            return saveOrUpdateSection({
              id: this.courseId,
              orderNum: index
            })
          }
        }))
        this.$message.success('数据更新成功')
      } catch (err) {
        this.$message.success('数据更新失败', err)
      }
      this.isLoading = false
      // 4. 由于是批量请求，可以使⽤ Promise.all() 便于进⾏统⼀操作
      // - 将 map 返回的，由 Axios 调⽤返回的 Promise 对象组成的数组，传⼊ 到 Promise.all() 中
    }
  }
}

</script>

<style lang="scss" scoped>
.inner {
  flex: 1; // 浏览器观察父元素设置了flex，当前元素设置flex: 1表示占满一行
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
}
// 由于为 Tree 组件内的元素，需要设置样式穿透
// 当前⾏具有类名 .el-tree-node__content 设置了固定⾼度 26px, 这⾥要改为 auto ⾃适应
::v-deep .el-tree-node__content {
  height: auto;
}
</style>
