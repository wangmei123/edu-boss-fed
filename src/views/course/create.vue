<template>
  <div class="course-create">
    <el-card>
      <div slot='header'>
        <!-- <el-steps :active="active" finish-status="success">
          <el-step title="基本信息" icon="el-icon-edit"></el-step>
          <el-step title="课程封面" icon="el-icon-upload"></el-step>
          <el-step title="销售信息" icon="el-icon-picture"></el-step>
          <el-step title="秒杀信息" icon="el-icon-picture"></el-step>
          <el-step title="课程详情" icon="el-icon-picture"></el-step>
        </el-steps> -->
        <el-steps :active="activeStep" simple>
          <!-- 由于组件没有 click 事件应添加 .native 设置原⽣事件 -->
          <el-step
            v-for="(item, i) in steps"
            :key="item.id"
            :title="item.title"
            :icon="item.icon"
            @click.native="activeStep = i"
          ></el-step>
        </el-steps>
      </div>
      <el-form label-width="80px">
        <div v-show="activeStep === 0">
          <el-form-item label="课程名称">
            <el-input
            v-model="courseList.courseName"
            maxlength="50"
            show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="课程简介">
            <el-input
            v-model="courseList.brief"
            maxlength="50"
            show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="课程概述">
            <el-input
              v-model="courseList.previewFirstField"
              placeholder="概述一"
              style="width: 49%; min-width: 300px;margin-right: 15px"
              maxlength="20"
              show-word-limit
            ></el-input>
            <el-input
              v-model="courseList.previewSecondField"
              placeholder="概述二"
              style="width: 49%; min-width: 300px"
              maxlength="20"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="讲师姓名">
            <el-input
              v-model="courseList.teacherDTO.teacherName"
              maxlength="50"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="讲师简介">
            <el-input
            v-model="courseList.teacherDTO.description"
            maxlength="100"
            show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="课程排序">
            <!-- 计数器组件 -->
            <el-input-number
              v-model="courseList.sortNum"
              label="描述⽂字"
              controls-position="right"
            >
            </el-input-number>
          </el-form-item>
        </div>
        <div v-show="activeStep === 1">
          <course-image v-model="courseList.courseListImg"></course-image>
          <course-image v-model="courseList.courseImgUrl"></course-image>
        </div>
        <div v-show="activeStep === 2">
          <!-- 销售信息 -->
          <el-form-item label="售卖价格">
            <el-input v-model="input2">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品原价">
            <el-input v-model="input2">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销量">
            <el-input v-model="input2">
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动标签">
            <el-input
              type="text"
              v-model="text"
              maxlength="4"
              show-word-limit
            >
            </el-input>
          </el-form-item>
        </div>
        <div v-show="activeStep === 3">
          <!-- 秒杀信息 -->
          <el-form-item label="限时秒杀开关" label-width="120px">
            <el-switch
              v-model="isSeckill"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <template v-if="isSeckill === true">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="value1"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束日期">
              <el-date-picker
                v-model="value1"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="秒杀价">
            <el-input v-model="input2">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="秒杀库存">
            <el-input v-model="input2">
              <template slot="append">个</template>
            </el-input>
          </el-form-item>
          </template>
        </div>
        <div v-show="activeStep === 4">
          课程详情
          <el-form-item>
            <el-button type="primary">保存</el-button>
          </el-form-item>
        </div>
        <!-- 下一步按钮 -->
        <el-form-item v-if="activeStep !== steps.length - 1">
          <el-button @click="activeStep++">下一步</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// import { saveOrUpdateCourse, upload} from '@/services/course'
import CourseImage from './components/course-image'
export default {
  name: 'CourseCreate',
  components: {
    CourseImage
  },
  data () {
    return {
      activeStep: 0,
      // 进度条数据信息
      steps: [
        { id: 1, title: '基本信息', icon: 'el-icon-edit' },
        { id: 2, title: '课程封⾯', icon: 'el-icon-upload' },
        { id: 3, title: '销售信息', icon: 'el-icon-picture' },
        { id: 4, title: '秒杀信息', icon: 'el-icon-picture' },
        { id: 5, title: '课程详情', icon: 'el-icon-picture' }
      ],
      imageUrl: '',
      isSeckill: false,
      courseList: {
        id: 0,
        courseName: '',
        brief: '',
        teacherDTO: {
          id: 0,
          courseId: 0,
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          description: ''
        },
        courseDescriptionMarkDown: '',
        price: 0,
        discounts: 0,
        priceTag: '',
        discountsTag: '',
        isNew: true,
        isNewDes: '',
        courseListImg: '',
        courseImgUrl: '',
        sortNum: 0,
        previewFirstField: '',
        previewSecondField: '',
        status: 0,
        sales: 0,
        activityCourse: true,
        activityCourseDTO: {
          id: 0,
          courseId: 0,
          beginTime: '',
          endTime: '',
          amount: 0,
          stock: 0
        },
        autoOnlineTime: ''
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.el-step {
  cursor: pointer
}

</style>
