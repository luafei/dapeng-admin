export const isValidUsername = (str: string) => ['admin', 'editor'].indexOf(str.trim()) >= 0

export const isExternal = (path: string) => /^(https?:|mailto:|tel:)/.test(path)

export const isArray = (arg: any) => {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

export const isValidURL = (url: string) => {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * 判断是否为空
 */
export function validatenull(val:any) {
  if (typeof val == 'boolean') {
      return false;
  }
  if (typeof val == 'number') {
      return false;
  }
  if (val instanceof Array) {
      if (val.length == 0) return true;
  } else if (val instanceof Object) {
      if (JSON.stringify(val) === '{}') return true;
  } else {
      if (val == 'null' || val == null || val == 'undefined' || val == undefined || val == '') return true;
      return false;
  }
  return false;
}

/**
 * 判断手机号码是否正确
 */
export function isvalidatemobile(phone:string) {
  let result = true;
  let msg = '';
  let list:[boolean, string] = [result, msg];
  var isPhone = /^1[3456789]\d{9}$/;
  //增加134 减少|1349[0-9]{7}，增加181,增加145，增加17[678]
  if (!validatenull(phone)) {
      if (phone.length == 11) {
          if (!isPhone.test(phone)) {
              msg = '手机号码格式不正确';
          } else {
              result = false;
          }
      } else {
          msg = '手机号码长度不为11位';
      }
  } else {
      msg = '请输入手机号码'
      result = true;
    //  msg = '手机号码不能为空';
  }
  list[0] = result
  list[1] = msg
  return list;
}

export const validatePhone = (rule:any, value:string, callback:Function) => { //校验手机号码
  const res = isvalidatemobile(value);
  if (res[0]) {
      return callback(new Error(res[1]));
  }
  callback();
};

export const isValidPassword = (value:string) => {
  let result:[boolean,string];
  // const isPass = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])[0-9a-zA-Z]{8,}$/.test(value)
  const isPass = /^.*(?=.{8,})(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*[!@#$%^&_=\-\+*?\(\)]).*$/.test(value)
  result = [isPass, isPass ? '' : '密码不少于8位数,包含数字、大小写英文字母、特殊字符']
  return result
}

export const  validatePassword = (rule: any, value: string, callback: Function) => {
  const result = isValidPassword(value)
  if (!result[0]) {
    callback(new Error(result[1]))
  } else {
    callback()
  }
}