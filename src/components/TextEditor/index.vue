<template>
  <div
    class="text-editor"
    ref="editor"
  >
  </div>
</template>

<script>
import E from 'wangeditor'

export default {
  name: 'TextEditor',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  mounted () {
    // 富文本编辑器的初始化
    this.initEditor()
  },
  methods: {
    initEditor () {
      const editor = new E(this.$refs.editor)
      editor.create()
      editor.txt.html(this.value)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
