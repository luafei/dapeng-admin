import request from '@/utils/request'

/**
 * 分页获取网页权限列表
 * @param params 
 */
export const webPagePermissionList = (params: any) =>
  request({
    url: '/permit/queryWebInfoPageList',
    method: 'get',
    params
  })

/**
 * 新增网页权限
 * @param data 
 */
export const addWebInfo = (data: any) =>
  request({
    url: '/permit/saveWebInfo',
    method: 'post',
    data
  })

/**
 * 删除网页权限
 * @param data 
 */ 
export const deleteWebInfo = (data: any) =>
  request({
    url: '/permit/deleteWebInfo',
    method: 'post',
    data
  })