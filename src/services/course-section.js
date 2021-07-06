import request from '@/utils/request'

// 分页查询课程信息
export const getSectionAndLesson = courseId => {
  return request({
    method: 'GET',
    url: '/boss/course/section/getSectionAndLesson',
    params: {
      courseId
    }
  })
}

// 新增或更新章节
export const saveOrUpdateSection = data => {
  return request({
    method: 'POST',
    url: '/boss/course/section/saveOrUpdateSection',
    data
  })
}

// 新增或更新课时（因课时功能较少，此处未单独封装模块，可⾃⾏处理）
export const saveOrUpdateLesson = data => {
  return request({
    method: 'POST',
    url: '/boss/course/lesson/saveOrUpdate',
    data
  })
}
