<template>
  <div class="alloc-menu">
      <!-- 角色id为：{{ $route.params.roleId}} -->
      角色id为：{{ roleId}}
  </div>
</template>

<script>
export default {
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [Number, String],
      required: true
    }
  }
}
</script>

<style>

</style>
