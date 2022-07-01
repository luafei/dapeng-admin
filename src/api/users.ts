import request from "@/utils/request";

export const getUsers = (params: any) =>
  request({
    url: "/users",
    method: "get",
    params
  });

// export const getUserInfo = (data: any) =>
//   request({
//     url: "/users/info",
//     method: "post",
//     data
//   });

export const getUserByName = (username: string) =>
  request({
    url: `/users/${username}`,
    method: "get"
  });

export const updateUser = (username: string, data: any) =>
  request({
    url: `/users/${username}`,
    method: "put",
    data
  });

export const deleteUser = (username: string) =>
  request({
    url: `/users/${username}`,
    method: "delete"
  });

// export const login = (data: any) =>
//   request({
//     url: "/users/login",
//     method: "post",
//     data
//   });

export const logout = () =>
  request({
    url: "/users/logout",
    method: "post"
  });

export const register = (data: any) =>
  request({
    url: "/users/register",
    method: "post",
    data
  });

/**
 * 获取用户列表
 * @param params
 */
export function getUserPageList(params: any) {
  return request({
    url: "/permit/queryUserInfoPageList",
    method: "get",
    params
  });
}

/**
 * 新增用户
 * @param data
 */
export function addUser(data: any) {
  return request({
    url: "/permit/saveUser",
    method: "post",
    data
  });
}

/**
 * 删除用户
 * @param data
 */
export function delUser(data: any) {
  return request({
    url: "/permit/deleteUserInfo",
    method: "post",
    data
  });
}

/**
 * 登录接口
 * @param params
 */
export const login = (params: any) =>
  request({
    url: "/permit/loginUser",
    method: "get",
    params
  });

/**
 * 获取用户信息
 * @param id 主键ID
 */
export const getUserInfo = (id: number) =>
  request({
    url: "/permit/queryUserInfo",
    method: "get",
    params: {
      id
    }
  });

/**
 * 判断账户名是否存在
 * @param params
 */
export const petNameIsExist = (params: any) =>
  request({
    url: "/permit/petNameIsExist",
    method: "get",
    params
  });

/**
 * 生成图形验证码
 * @param flag 时间戳
 */
export const getPicCode = (params: any) =>
  request({
    url: "/permit/createPicCode",
    method: "get",
    params,
    responseType: "arraybuffer"
  });

/**
   * 调用系统内置DSVS证书
   */
export const getDSVSCert = () =>
  request({
    url: "/bjca/getStep3",
    method: "get"
  });

/**
 * 手工推送预警信息
 */
export const getStep910 = (data:any)  => 
  request({
    url: '/bjca/getStep910',
    data,
    method: 'post',
    headers: {
      'Content-Type': "application/json",
    }
  })


/**
* 获取用户信息登陆
*/
export function queryUserBySfId(params:any) {
  return request({
    url: '/bjca/queryUserBySfId',
    method: 'get',
    params
  })
}
