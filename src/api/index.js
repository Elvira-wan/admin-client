// 包含应用中所有接口请求函数的模块
// 每个接口函数的返回值都是Promise
// 要求：能根据接口文档定义接口请求函数

import ajax from "./ajax";

// const BASE = 'http://localhost:3000'
// 登录接口请求函数
export const reqLogin =  (username, password) => ajax('/login', {username, password}, 'POST');

// 添加用户
export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST');

// 天气更新
export const reqWeather = () => ajax('https://restapi.amap.com/v3/weather/weatherInfo?city=360111&key=73e3121f8a251a23b0120317c455c46b');

// 获取品类
export const reqCategory = (parentId) => ajax('/manage/category/list', {parentId});
// 添加分类，两种传参方式 ———— 直接传多个参数
export const reqAddCategory = (parentId, categoryName) => ajax('/manage/category/add', {parentId, categoryName}, 'POST');
// 更新品类名称，两种传参方式 ———— 从对象中解构
export const reqUpdateCategory = ({categoryId,categoryName}) => ajax('/manage/category/update', {categoryId, categoryName}, 'POST');