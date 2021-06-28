// course/index.vue 课程组件
<template>
  <div class="course">
    <course-list></course-list>
  </div>
</template>

<script>
import CourseList from './components/list.vue'

export default {
  name: 'CourseIndex',
  components: {
    CourseList
  }
}
</script>

<style lang="scss" scoped></style>
