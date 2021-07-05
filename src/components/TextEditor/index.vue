<template>
  <div
    class="text-editor"
    ref="editor"
  >
  </div>
</template>

<script>
import E from 'wangeditor'
import { upload } from '@/services/course'

export default {
  name: 'TextEditor',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      editor: null,
      isLoading: false
    }
  },
  mounted () {
    // 富文本编辑器的初始化
    this.initEditor()
  },
  methods: {
    initEditor () {
      const editor = new E(this.$refs.editor)
      // 当富⽂本编辑器输⼊完毕需要提交时，需要将内容传出给⽗组件，这时使⽤编辑器提供的⽅法操作
      // value 为输⼊的内容，通过⾃定义事件传出即可 (注意 this 指向，建议使 ⽤箭头函数)
      editor.config.onchange = value => {
        this.$emit('input', value)
      }
      // 自己实现图片上传功能
      editor.config.customUploadImg = async (resultFiles, insertImgFn) => {
        // resultFiles 是 input 中选中的文件列表
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法
        // 上传图片，返回结果，
        // console.log('resultFiles', resultFiles[0])
        const fd = new FormData()
        fd.append('file', resultFiles[0])
        const { data } = await upload(fd)
        // console.log('data', data)
        if (data.code === '000000') {
          this.$message.success('上传成功')
          // 将图片插入到编辑器中
          insertImgFn(data.data.name)
        }
      }
      editor.create()
      editor.txt.html(this.value)
      this.editor = editor
    }
  },
  // 由于编辑请求数据为异步操作，⽽富⽂本编辑器中的 DOM 功能为同步，所以编辑时会出现富⽂本编辑器 显示默认⽂本的情况，这时需要通过 watch 来侦听 value 变化，并进⾏初始内容更新（新增功能不存在 此问题）。
  watch: {
    value () {
      if (!this.isLoading) {
        this.editor.txt.html(this.value)
        this.isLoading = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
