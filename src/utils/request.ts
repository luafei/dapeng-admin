import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { UserModule } from '@/store/modules/user'

const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: process.env.NODE_ENV == 'production' ? process.env.VUE_APP_BASE_API : '', // 开发环境时本地配置proxy跨域，生产环境时补全接口路径
  timeout: 60*1000
  // withCredentials: true // send cookies when cross-domain requests
})

// Request interceptors
service.interceptors.request.use(
  (config) => {
    // Add X-Access-Token header to every request, you can add other custom headers here
    if (UserModule.token) {
      config.headers['token'] = UserModule.token
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)
const whileList = ["/pc/exportTypeLonLatExcel", "/pc/exportHkDicAll", "/pc/exportBusStationExcel", "/pc/exportBeachExcel", '/permit/createPicCode'] //由于后端返回的数据结构不统一，只能鸡肋的做个白名单过滤了~~
// Response interceptors
service.interceptors.response.use(
  (response) => {
    // Some example codes here:
    // code == 20000: success
    // code == 50001: invalid access token
    // code == 50002: already login in other place
    // code == 50003: access token expired
    // code == 50004: invalid user (user not exist)
    // code == 50005: username or password is incorrect
    // You can change this part for your own usage.
    const res = response.data
    if (res.status !== 0) {
      if(whileList.includes(response.config.url)){
        return response
      }
      response.config.url !== '/permit/petNameIsExist' && Message({
        message: res.data || res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          UserModule.ResetToken()
          location.reload() // To prevent bugs from vue-router
        })
      }
      return Promise.reject(new Error(res.data || res.msg || 'Error'))
    } else {
      return response.data
    }
  },
  (error) => {
    Message({
      message: error.msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
