<template>
  <div class="course-image">
     <el-form-item :label="label">
       <!-- 上传进度 -->
        <el-progress
        type="circle"
        :percentage="precent"
        :width="178"
        v-if="isUploading"
        ></el-progress>
         <!-- 自定义上传图片 -->
         <!-- :on-progress="handleProgress" -->
        <el-upload
            v-else
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
    },
    label: {
      type: String
    },
    // 设置图片限制大小
    limit: {
      type: Number,
      default: 2
    }
  },
  data () {
    return {
      // 用于保存上传状态
      isUploading: false,
      precent: 0
    }
  },
  methods: {
    // handleProgress (event, file) {
    //   console.log('file', event, file) // 打印没有内容,因为自定义上传事件覆盖了默认的上传事件
    // },
    // Upload 组件提供了 http-request 属性⽤于覆盖默认的上传⾏为，⽤于实现⾃定义上传。
    async handleUpload (options) {
      this.isUploading = true
      // console.log('options', options)
      const fd = new FormData()
      fd.append('file', options.file)
      const { data } = await upload(fd, event => {
        // console.log(event.total, event.loaded)
        this.precent = Math.floor(event.loaded / event.total * 100)
      })
      // console.log('data', data)
      if (data.code === '000000') {
        // this.courseList.courseListImg = data.data.name
        // 子传父  vm.$emit( event, arg ) //触发当前实例上的事件
        this.$emit('input', data.data.name)
        this.isUploading = false
        // 上传成功后将进度归0避免下次上传时进度条回退现象
        this.precent = 0
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
