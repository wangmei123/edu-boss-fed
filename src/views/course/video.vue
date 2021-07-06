<template>
  <div class="course-video">
      <el-card>
          <div slot="header">
              课程相关信息
          </div>
          <el-form>
              <el-form-item label="视频上传">
                  <input type="file" ref="video-file">
              </el-form-item>
              <el-form-item label="封面上传">
                  <input type="file" ref="image-file">
              </el-form-item>
              <el-form-item>
                  <el-button
                  type="primary"
                  @click="handleUpload"
                  >开始上传</el-button>
                  <el-button
                  @click="$router.push({
                      name: 'course-section',
                      params: {
                        courseId
                      }
                  })"
                  >返回</el-button>
              </el-form-item>
              <el-form-item>
                <p v-if="uploadPercent !== 0">视频上传中: {{ uploadPercent }}%</p>
                <p v-if="isUploadSuccess">视频转码中：{{ isTranscodeSuccess ? '完成': '正在转码中...' }}</p>
              </el-form-item>
          </el-form>
      </el-card>
  </div>
</template>

<script>
import { aliyunImag, aliyunVideo, aliyunTranscode, getAliyunTranscodePercent } from '@/services/aliyun-upload'

export default {
  name: 'CourseVideo',
  props: {
    courseId: {
      type: [Number, String],
      retuired: true
    }
  },
  data () {
    return {
      // 图片上传后的地址,用于视频上传请求凭证
      imageURL: '',
      // 保存上传实例
      uploader: null,
      // 保存上传视频的 ID
      videoId: null,
      // 上传百分比
      uploadPercent: 0,
      // 上传完毕状态
      isUploadSuccess: false,
      // 转码完毕状态
      isTranscodeSuccess: false
    }
  },
  created () {
    this.initUploader()
  },
  methods: {
    handleUpload () {
      // 考虑到可能重复使用某个组件进行上传处理，点击上传时，将数据重置
      this.uploadPercent = 0
      this.isUploadSuccess = false
      this.isTranscodeSuccess = false
      // 获取上传的⽂件（视频、图⽚）
      const videoFile = this.$refs['video-file'].files[0]
      const imageFile = this.$refs['image-file'].files[0]
      // console.log(videoFile, imageFile)
      // uploader.addFile() 将⽂件添加到上传列表，多次调⽤会按顺序发送⽂件（后期由于接⼝要求要先发图）
      // uploader.startUpload() 开始上传
      // 将⽂件添加到上传列表
      const uploader = this.uploader
      uploader.addFile(imageFile)
      uploader.addFile(videoFile)
      // 开始上传 上⾯的⽂件回按添加的顺序依次上传
      uploader.startUpload()
    },
    initUploader () {
      this.uploader = new window.AliyunUpload.Vod({
        // userID，必填，只需有值即可。
        userId: '1618139964448548',
        // 上传到视频点播的地域，默认值为'cn-shanghai'
        // eu-central- 1，ap-southeast-1
        region: '',
        // 分片大小默认1 MB，不能小于100 KB
        partSize: 1048576,
        // 并行上传分片个数，默认5
        parallel: 5,
        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 是否上报上传日志到视频点播，默认为true
        enableUploadProgress: true,
        // 开始上传 触发上传后，⽂件并没有真正开始上传，因为还需要发送上传凭证和地址，这⾥需要使⽤到后端提供的接⼝。
        onUploadstarted: async uploadInfo => {
        //   console.log('onUploadstarted', uploadInfo)
          // 1. 声明变量存储得到上传凭证
          let uploadAddressAndAuth = null
          // 2. 根据 isImage 检测上传⽂件类型
          if (uploadInfo.isImage) {
            const { data } = await aliyunImag()
            // console.log('data', data)
            if (data.code === '000000') {
              // 3. data.data 即为凭证信息组成的对象
              uploadAddressAndAuth = data.data
              // 5. 保存图⽚地址，给视频接⼝使⽤
              this.imageURL = uploadAddressAndAuth.imageURL
            }
          } else {
            // 4. 观察 uploadInfo 数据，根据请求参数名设置参数
            const { data } = await aliyunVideo({
              fileName: uploadInfo.file.name,
              imageUrl: this.imageURL
            })
            if (data.code === '000000') {
              // 6. 存储凭证
              uploadAddressAndAuth = data.data
              this.videoId = data.data.videoId
            }
          }

          // ⼆、设置凭证
          this.uploader.setUploadAuthAndAddress(
            uploadInfo,
            uploadAddressAndAuth.uploadAuth,
            uploadAddressAndAuth.uploadAddress,
            uploadAddressAndAuth.imageId || uploadAddressAndAuth.videoId
          )
          // 设置完毕，上传进度开始执⾏
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo) {
        //   console.log('onUploadSucceed', uploadInfo)
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo, code, message) {
          console.log('onUploadFailed', uploadInfo, code, message)
        },
        // 文件上传进度，单位：字节
        // 使用了this 一定要改成箭头函数,否则没有办法获取到正确的this,不能赋值成功
        onUploadProgress: (uploadInfo, totalSize, loadedPercent) => {
          if (!uploadInfo.isImage) {
            // console.log('onUploadProgress', loadedPercent)
            this.uploadPercent = Math.floor(loadedPercent * 100)
            console.log('onUploadProgress', this.uploadPercent)
          }
        },
        // 上传凭证超时
        onUploadTokenExpired: function (uploadInfo) {
        // 实现时，根据uploadInfo.videoId调用刷新视频上传凭证接口重新获取UploadAuth
        // 从点播服务刷新的uploadAuth，设置到SDK里
          console.log('onUploadTokenExpired', uploadInfo)
        },
        // 全部文件上传结束
        onUploadEnd: async uploadInfo => {
          // console.log('onUploadEnd', uploadInfo)
          this.isUploadSuccess = true
          const lessonId = this.$route.query.lessonId
          // 发送视频转码请求
          const { data } = await aliyunTranscode({
            lessonId,
            coverImageUrl: this.imageURL,
            fileId: this.videoId,
            fileName: this.$refs['video-file'].files[0].name
          })
          if (data.code === '000000') {
            // 轮询转码进度
            const timer = setInterval(async () => {
              const { data } = await getAliyunTranscodePercent(lessonId)
              //   console.log('data', data)
              if (data.code === '000000') {
                if (data.data === 100) {
                  this.isTranscodeSuccess = true
                  this.$message.success('视频转码成功')
                  clearInterval(timer)
                }
              }
            }, 1000)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
