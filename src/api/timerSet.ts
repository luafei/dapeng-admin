import request from '@/utils/request'

export const getTimerSetList = (data: any) =>
  request({
    url: '/timerSet/getTimerList',
    method: 'post',
    data
  })

export const saveTimer = (data: any) =>
  request({
    url: '/timerSet/saveTimer',
    method: 'post',
    data
  })
export const updateTimer = (data: any) =>
  request({
    url: '/timerSet/updateTimer',
    method: 'post',
    data
  })
export const delTimer = (data: any) =>
  request({
    url: '/timerSet/delTimer',
    method: 'post',
    data
  })


export const queryTypeList = () =>
  request({
    url: '/timerSet/queryTypeList',
    method: 'post'
  })
export const getTimerItemList = (data: any) =>
  request({
    url: '/timerSet/getTimerItemList',
    method: 'post',
    data
  })

export const saveItemTimer = (data: any) =>
  request({
    url: '/timerSet/saveItemTimer',
    method: 'post',
    data
  })
export const updateItemTimer = (data: any) =>
  request({
    url: '/timerSet/updateItemTimer',
    method: 'post',
    data
  })
export const delTimerItem = (data: any) =>
  request({
    url: '/timerSet/delTimerItem',
    method: 'post',
    data
  })
