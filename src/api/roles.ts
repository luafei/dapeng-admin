import request from '@/utils/request'

export const getRoles = (params: any) =>
  request({
    url: '/roles',
    method: 'get',
    params
  })

export const createRole = (data: any) =>
  request({
    url: '/roles',
    method: 'post',
    data
  })

export const updateRole = (id: number, data: any) =>
  request({
    url: `/roles/${id}`,
    method: 'put',
    data
  })

export const deleteRole = (id: number) =>
  request({
    url: `/roles/${id}`,
    method: 'delete'
  })

export const getRoutes = (params: any) =>
  request({
    url: '/routes',
    method: 'get',
    params
  })



/**
 * 获取角色分页列表
 * @param params 
 */
export const rolePageList = (params: any) =>
  request({
    url: '/permit/queryRoleInfoPageList',
    method: 'get',
    params
  })

/**
 * 获取角色列表
 */  
export const getRoleList = () =>
  request({
    url: '/permit/queryRoleInfoList',
    method: 'get'
  })

/**
 * 新增角色
 * @param data 
 */
export const addRole = (data: any) =>
  request({
    url: '/permit/saveRoleInfo',
    method: 'post',
    data
  })

/**
 * 删除角色
 * @param data 
 */
export const delRole = (data: any) =>
  request({
    url: '/permit/deleteRoleInfo',
    method: 'post',
    data
  })