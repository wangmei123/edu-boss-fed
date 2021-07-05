<template>
  <div class="course-section">
      <el-card>
          <el-tree
            :data="sections"
            :props="defaultProps"
            draggable
            ></el-tree>
      </el-card>
  </div>
</template>

<script>
import { getSectionAndLesson } from '@/services/course-section.js'

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
      }
    }
  },
  created () {
    this.loadSection()
  },
  methods: {
    async loadSection () {
      const { data } = await getSectionAndLesson(this.courseId)
      //   console.log('data', data)
      if (data.code === '000000') {
        this.sections = data.data
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
