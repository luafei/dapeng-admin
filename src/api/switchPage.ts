import request from "@/utils/request";

/**
 * 获取规则列表
 */
export function queryDicPageStatus() {
    return request({
      url: "/pc/queryDicPageStatus",
      method: "get"
    });
  }

/**
 * 更新或新增界面控制开关
 * @param data 
 */
export function alterDicPageStatus(data:any) {
    return request({
      url: "/pc/alterDicPageStatus",
      method: "post",
      data
    });
  }