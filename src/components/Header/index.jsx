import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
// 引入弹出框
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
// 引入天气请求函数
import { reqWeather } from '../../api'
import { formateDate } from '../../utils/dateUtils'
// 引入菜单配置
import menuList from '../../config/menuConfig'
// 引入内存
import storageUtils from '../../utils/storageUtils'
import memoryUtils from '../../utils/memoryUtils'

import LinkButton from '../LinkButton'
import './index.less'

const { confirm } = Modal;
class Header extends Component {
    state = {
        city: '',
        weather: '',
        temperature: '',
        sysTime: formateDate(Date.now())
    }
    // 查询天气函数
    getWeather = async () => {
        const data = await reqWeather();
        // 如果查询天气成功
        if (data.status === "1") {
            const { city, weather, temperature } = data.lives[0];
            this.setState({ city, weather, temperature });
        }
    }
    // 同步获取时间函数
    getSysTime = () => {
        this.interValId = setInterval(() => {
            this.setState({ sysTime: formateDate(Date.now()) })
        }, 1000)
    }
    // 根据请求的path获取得到对应的标题
    getTitle = (path) => {
        let title;
        menuList.forEach(item => {
            if (item.key === path) {
                title = item.title;
            } else if (item.children) {
                item.children.forEach(citem => {
                    if (citem.key === path) {
                        title = citem.title;
                    }
                })
            }
        })
        return title;
    }
    // 退出登录
    logout = () => {
        confirm({
            title: '确定退出吗?',
            icon: <ExclamationCircleOutlined />,
            content: '一旦操作不可撤销',
            // 注意：这里要将onOK改为箭头函数，否则可能出现this.props报错无法读取this值的情况
            onOk: () => {
                console.log('OK');
                // 将用户数据从localStorage中移除
                storageUtils.removeUser();
                // 将用户数据从memoryUtils中移除
                memoryUtils.user = {};
                // 跳转到login
                this.props.history.replace('/login');
            },
            onCancel:() => {
                console.log('Cancel');
            }
        });
    }
    // 挂载组件时调用获取时间和天气函数
    componentDidMount() {
        this.getWeather();
        this.getSysTime();
    }
    // 在组件卸载之前清除浏览器
    componentWillUnmount() {
        clearInterval(this.interValId);
    }
    render() {
        const { city, weather, temperature, sysTime } = this.state;
        // 通过路径获取时间
        const path = this.props.location.pathname;
        const title = this.getTitle(path)
        // 从内存中获取用户名
        const user = memoryUtils.user.username;
        return (
            <div className="header-box">
                <div className="header-top">
                    <span>Hello, {user}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="path-box">{title}</div>
                    <div className="weather-box">
                        <span className="date">{sysTime}</span>
                        <span className="distinct">{city}</span>
                        <span className="weather">{weather} &nbsp;{temperature}℃</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header);