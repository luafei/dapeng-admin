import request from "@/utils/request";

/**
 * 获取规则列表
 * @param params 
 */
export function getRuleList(params: any) {
    return request({
      url: "/pc/queryAlarmRegulationPageList",
      method: "get",
      params
    });
  }

/**
 * 获取预警类型树
 */
export function getAlarmTypeTree() {
    return request({
      url: "/pc/queryAlarmTypeTree",
      method: "get"
    });
  }

/**
 * 新增预警规则
 * @param data 
 */
export function addRule(data: any){
  return request({
    url: "/pc/saveAlarmRegulation",
    method: 'post',
    data
  })
}

/**
 * 修改预警规则
 * @param data 
 */
export function updateRule(data: any){
  return request({
    url: "/pc/updateAlarmRegulation",
    method: 'post',
    data
  })
}

/**
 * 获取规则详情
 * @param id 
 */
export function getRuleDetail(id: number){
  return request({
    url: "/pc/queryAlarmRegulation",
    method: 'get',
    params: {
      id
    }
  })
}


/**
 * 删除推送规则
 * @param ids 
 */
export function delRule(ids:string) {
  return request({
    url: "/pc/deleteAlarmRegulation",
    method: "get",
    params: {
      ids
    }
  });
}
