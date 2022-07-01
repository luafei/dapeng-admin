import request from "@/utils/request";

function exportFn(url:string, tableName:string){
  return request({
    url: url,
    responseType: 'arraybuffer', //导出需加参数
    method: 'get'
  }).then(res => {
    const link = document.createElement('a')
    let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)

    // link.download = res.headers['content-disposition'] //下载后文件名
    link.download = tableName //下载的文件名
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}

/**
 * 获取码表列表
 * @param params 
 */
export function getTableCodeList(params: any) {
    return request({
      url: "/pc/queryHKDicAllPageList",
      method: "get",
      params
    });
  }

/**
 * 新增码表
 * @param data 
 */
export const addTableCode = (data:any) => 
  request({
    url: '/pc/saveHKDicAll',
    method: 'post',
    data
  })

/**
 * 修改码表
 * @param data 
 */
export const updateTableCode = (data:any) =>
  request({
    url: '/pc/updateHKDicAll',
    method: 'post',
    data
  })

/**
 * 删除码表
 * @param ids 
 */
export const delTableCode = (ids:string) =>
  request({
    url:'/pc/deleteHKDicAll',
    method: 'get',
    params: {
      ids
    }
  })

/**
 * 导入视频关系表记录
 * @param file 
 */
export const importTableCode = (file:any) => {
  const formData = new FormData();
  formData.append('multipartFile',file)
  return request({
    url:'/pc/importHkDicAll',
    method: 'post',
    data: formData
  })
}

/**
 * 导出视频关系表记录
 */
export const exportTableCode = () => {
  return exportFn('/pc/exportHkDicAll', '视频关系表')
}



/**
 * 分页查询图标落图码表数据
 * @param params 
 */
export function getIconTableList(params: any) {
  return request({
    url: "/pc/queryTypeLonLatPageList",
    method: "get",
    params
  });
}

/**
 * 新增图标落图码表数据
 * @param data 
 */
export const addIconTableCode = (data:any) => 
  request({
    url: '/pc/saveTypeLonLat',
    method: 'post',
    data
  })

/**
 * 修改图标落图码表数据
 * @param data 
 */
export const updateIconTableCode = (data:any) => 
  request({
    url: '/pc/updateTypeLonLat',
    method: 'post',
    data
  })

/**
 * 删除图标落图码表记录
 * @param ids 
 */
export const delIconTableCode = (ids:string) =>
  request({
    url:'/pc/deleteTypeLonLat',
    method: 'get',
    params: {
      ids
    }
  })

/**
 * 分页查询停车场码表数据
 *  @param params
 */
export function getparKingTabeList (params:any) {
  return request ({
    url: '/pc/queryParkDicPageList',
    method:'GET',
    params
  });
}

/**
 * 新增停车场码表数据
 *  @param data 
 */
export const addparKingTableCode = (data:any) => {
  request ({
    url:'/pc/saveParkDic',
    method:'POST',
    data
  })
}

/** 
 *  修改停车场码表数据
 * @param data
 */
export const updateparKingTabeCode = (data:any) => {
  request ({
    url:'/pc/updateParkDic',
    method:'POST',
    data
  })
}

/**
 * 删除停车场码表数据
 * @param ids 
 */
export const delparKingTableCode = (ids:string) => {
  request ({
    url:'/pc/deleteParkDic',
    method:'GET',
    params:{
      ids
    }
  })
}

/**
 *  分页查询沙滩视频分类码表
 * @param params 
 */
export function getbeachVideoTableList (params:any) {
 return request ({
   url:'/pc/queryVideoTypeDicPageList',
   method:'GET',
   params
 })
}

/**
 *  新增沙滩视频分类码表
 * @param data 
 */
export const addbeachVideoTableCode = (data:any) => {
 request ({
   url:'/pc/saveVideoTypeDic',
   method:'POST',
   data
 })
}

/**
 *  修改沙滩视频分类码表数据
 * @param data 
 */
export const updatabeachVideoTableCode = (data:any) => {
  request ({
    url:'/pc/updateVideoTypeDic',
    method:'POST',
    data
  })
}

/**
 *  删除沙滩视频分类码表数据
 * @param ids
 */
export const delbeachVideoTableCode = (ids:string) => {
  request ({
    url:'/pc/deleteVideoTypeDic',
    method:'GET',
    params:{
      ids
    }
  })
}
/**
 * 导入图标落图码表记录
 * @param file 
 */
export const importIconTableCode = (file:any) => {
  const formData = new FormData();
  formData.append('multipartFile',file)
  return request({
    url:'/pc/importTypeLonLatExcel',
    method: 'post',
    data: formData
  })
}

/**
 * 导出图标落图码表记录
 */
export const exportIconTableCode = () => {
  return exportFn('/pc/exportTypeLonLatExcel', '图标落图码表')
}


/**
 * 分页查询公交站点码表数据
 * @param params 
 */
export function getBusCodeList(params: any) {
  return request({
    url: "/pc/queryBusStationPageList",
    method: "get",
    params
  });
}

/**
 * 新增公交站点码表数据
 * @param data 
 */
export const addBusCode = (data:any) => 
  request({
    url: '/pc/saveBusStation',
    method: 'post',
    data
  })

/**
 * 更新公交站点码表数据
 * @param data 
 */
export const updateBusCode = (data:any) => 
  request({
    url: '/pc/updateBusStation',
    method: 'post',
    data
  })

/**
 * 删除公交站点码表记录
 * @param ids 
 */
export const delBusCode = (ids:string) =>
  request({
    url:'/pc/deleteBusStation',
    method: 'get',
    params: {
      ids
    }
  })

/**
 * 导出公交站点码表记录
 */
export const exportBusCode = () => {
  return exportFn('/pc/exportBusStationExcel', '公交站点码表')
}

/**
 * 导入公交站点码记录
 * @param file 
 */
export const importBusCode = (file:any) => {
  const formData = new FormData();
  formData.append('multipartFile',file)
  return request({
    url:'/pc/importBusStationExcel',
    method: 'post',
    data: formData
  })
}


/**
 * 分页查询节假日字典表数据
 * @param params 
 */
export function getHolidayCodeList(params: any) {
  return request({
    url: "/pc/queryHolidayPageList",
    method: "get",
    params
  });
}

/**
 * 新增公交站点码表数据
 * @param data 
 */
export const addHolidayCode = (data:any) => 
  request({
    url: '/pc/saveHoliday',
    method: 'post',
    data
  })

/*
  * 更新公交站点码表数据
  * @param data 
  */
 export const updateHolidayCode = (data:any) => 
   request({
     url: '/pc/updateHoliday',
     method: 'post',
     data
   })

/**
 * 删除公交站点码表记录
 * @param ids 
 */
export const delHolidayCode = (ids:string) =>
  request({
    url:'/pc/deleteHoliday',
    method: 'get',
    params: {
      ids
    }
  })


/**
 * 分页查询节假日字典表数据
 * @param params 
 */
export function getCoordinateMapList(params: any) {
  return request({
    url: "/pc/queryMapCoordinateLocationPageList",
    method: "get",
    params
  });
}

/**
 * 新增公交站点码表数据
 * @param data 
 */
export const addCoordinateMapCode = (data:any) => 
  request({
    url: '/pc/saveMapCoordinateLocation',
    method: 'post',
    data
  })

/*
  * 更新公交站点码表数据
  * @param data 
  */
 export const updateCoordinateMapCode = (data:any) => 
   request({
     url: '/pc/updateMapCoordinateLocation',
     method: 'post',
     data
   })

/**
 * 删除公交站点码表记录
 * @param ids 
 */
export const delCoordinateMapCode = (ids:string) =>
  request({
    url:'/pc/deleteMapCoordinateLocation',
    method: 'get',
    params: {
      ids
    }
  })


/**
 * 分页查询沙滩字典表数据
 * @param params 
 */
export function getBeachDicPageList(params: any) {
  return request({
    url: "/pc/queryBeachDicPageList",
    method: "get",
    params
  });
}

/**
 * 新增沙滩码表数据
 * @param data 
 */
export const addBeachDic = (data:any) => 
  request({
    url: '/pc/saveBeachDic',
    method: 'post',
    data
  })

/*
  * 更新沙滩码表数据
  * @param data 
  */
 export const updateBeachDic = (data:any) => 
   request({
     url: '/pc/updateBeachDic',
     method: 'post',
     data
   })

/**
 * 删除沙滩码表记录
 * @param ids 
 */
export const deleteBeachDic = (ids:string) =>
  request({
    url:'/pc/deleteBeachDic',
    method: 'get',
    params: {
      ids
    }
  })

/**
 * 导出沙滩码表记录
 */
export const exportBeachCode = () => {
  return exportFn('/pc/exportBeachExcel', '沙滩码表')
}

/**
 * 导入沙滩码记录
 * @param file 
 */
export const importBeachCode = (file:any) => {
  const formData = new FormData();
  formData.append('multipartFile',file)
  return request({
    url:'/pc/importBeachExcel',
    method: 'post',
    data: formData
  })
}


/**
 * 分页查询行政服务网点码表数据
 * @param params 
 */
export function getGvoNetworkDicPageList(params: any) {
  return request({
    url: "/pc/queryGvoNetworkDicPageList",
    method: "get",
    params
  });
}

/**
 * 新增政服务网点码表数据
 * @param data 
 */
export const addGvoNetworkDic = (data:any) => 
  request({
    url: '/pc/saveGvoNetworkDic',
    method: 'post',
    data
  })

/*
  * 更新政服务网点码表数据
  * @param data 
  */
 export const updateGvoNetworkDic = (data:any) => 
   request({
     url: '/pc/updateGvoNetworkDic',
     method: 'post',
     data
   })

/**
 * 删除政服务网点码表记录
 * @param ids 
 */
export const delGvoNetworkDic = (ids:string) =>
  request({
    url:'/pc/deleteGvoNetworkDic',
    method: 'get',
    params: {
      ids
    }
  })
/**
 * 分页查询今日领导值班信息
 * @param params 
 */
export function getTodayguards(params: any) {
  return request({
    url: "/pc/queryTodayDutyLeaderPageList",
    method: "get",
    params
  });
}
/**
 * 新增今日领导值班信息
 *  @param data 
 */
export const addTodayguards = (data:any) => {
  request ({
    url:'/pc/saveTodayDutyLeader',
    method:'POST',
    data
  })
}
/** 
 *  更新今日领导值班信息
 * @param data
 */
export const updateTodayguards = (data:any) => {
  request ({
    url:'/pc/updateTodayDutyLeader',
    method:'POST',
    data
  })
}
/**
 * 删除今日领导值班信息
 * @param ids 
 */
export const delTodayguards = (ids:string) => {
  request ({
    url:'/pc/deleteTodayDutyLeader',
    method:'GET',
    params:{
      ids
    }
  })
}

/**
 * 分页查询本周领导值班信息
 * @param params 
 */
export function getWeekguards(params: any) {
  return request({
    url: "/pc/queryWeekDutyLeaderPageList",
    method: "get",
    params
  });
}

/**
 * 新增本周领导值班信息
 *  @param data 
 */
export const addWeekguards = (data:any) => {
  request ({
    url:'/pc/saveWeekDutyLeader',
    method:'POST',
    data
  })
}

/** 
 *  更新本周领导值班信息
 * @param data
 */
export const updateWeekguards = (data:any) => {
  request ({
    url:'/pc/updateWeekDutyLeader',
    method:'POST',
    data
  })
}

/**
 * 删除本周领导值班信息
 * @param ids 
 */
export const delWeekguards = (ids:string) => {
  request ({
    url:'/pc/deleteWeekDutyLeader',
    method:'GET',
    params:{
      ids
    }
  })
}