// 包含应用中所有接口请求函数的模块
// 每个接口函数的返回值都是Promise
// 要求：能根据接口文档定义接口请求函数

import ajax from "./ajax";

const BASE = 'http://localhost:3000'
// 登录接口请求函数
export const reqLogin =  (username, password) => ajax(BASE + '/login', {username, password}, 'POST');

// 添加用户
export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST');