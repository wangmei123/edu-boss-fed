import request from '@/utils/request'

// 按条件分页查询资源
export const getResourcePages = data => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data
  })
}

// 查询资源分类列表
export const getCategoryAll = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/category/getAll'
  })
}
