<template>
  <div class="course-image">
     <el-form-item label="课程封面">
         <!-- 自定义上传图片 -->
        <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :http-request="handleUpload"
            >
            <!-- 图⽚预览修改为当前Upload对应数据 -->
            <img v-if="value" :src="value" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </el-form-item>
  </div>
</template>

<script>
import { upload } from '@/services/course'
export default {
  name: 'CourseImage',
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      imageUrl: ''
    }
  },
  methods: {
    // Upload 组件提供了 http-request 属性⽤于覆盖默认的上传⾏为，⽤于实现⾃定义上传。
    async handleUpload (options) {
      // console.log('options', options)
      const fd = new FormData()
      fd.append('file', options.file)
      const { data } = await upload(fd)
      // console.log('data', data)
      if (data.code === '000000') {
        // this.courseList.courseListImg = data.data.name
        // 子传父
        this.$emit('input', data.data.name)
        this.$message.success('上传成功')
      }
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style lang="scss" scoped>
// 样式选择器为 .avatar-uploader .el-upload ，
// 说明选择器选取的元素已经不存在于 create.vue 组件中，⽽是处于 create.vue 的⼦组件 <el-upload> 中。
// 同时，由于当前组件设置了 scoped ，使样式只作⽤于当前组件中的元素，让选择器⽆效。
// 如果希望 scoped 中的某个选择器能够作⽤得更深，如影响⼦组件样式，就需要使⽤ >>> 操作符。
// >>> 与 /deep/ 和 ::v-deep 功能相同，推荐 ::v-deep
// 官⽅称为深度作⽤选择器，开发⼈员间也简称为样式穿透。
// 只有作⽤于⾮⼦组件根元素的选择器才需要设置 ::v-deep
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
