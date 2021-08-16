import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd'

import memoryUtils from '../../utils/memoryUtils.js'
import menuList from '../../config/menuConfig.jsx'

const { SubMenu } = Menu;

class LeftNav extends Component {
    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname;
        return menuList.map(item => {
            if (this.hasAuth(item)) {
                if (!item.children) {
                    return (
                        // 想让icon的值动态显示为item.icon
                        <Menu.Item key={item.key} icon={item.icon}>
                            <Link to={item.key}>
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    )
                } else {
                    // 如果当前请求路由与当前菜单的某个子菜单的key相匹配，则将菜单的key保存在openkey中
                    if (item.children.find(cItem => path.indexOf(cItem.key) === 0)) {
                        this.openKey = item.key
                    }
                    return (
                        <SubMenu
                            key={item.key}
                            title={
                                <span>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </span>
                            }
                        >
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    )
                }
            }
            // 消除警告设置返回，返回值不重要
            return item;
        })
    }
    
    // 判断当前用户是否有看到当前item对应菜单项的权限
    hasAuth = (item) => {
        const key = item.key;
        const menuSet = this.menuSet;
        // 若此项设置为公开 或 当前为admin登录 或 渲染菜单Set中含有当前项
        if (item.isPublic || memoryUtils.user.username === 'admin' || menuSet.has(key)) {
            return true
        } else if (item.children) {
            // 若存在子节点的化则遍历其子节点是否含有显示项，并强行转化为 boolean值
            return !!item.children.find(child => menuSet.has(child.key))
        }
    }

    // 在组件初次挂载之前调用函数渲染画面
    UNSAFE_componentWillMount() {
        // 将当前用户可访问的菜单项存储在Set中
        this.menuSet = new Set(memoryUtils.user.role.menus || [])
        this.menuNodes = this.getMenuNodes(menuList);
    }

    render() {
        // 解决商品详情页path不相等导致无法选中Link的问题
        let path = this.props.location.pathname;
        if (path.indexOf('/product') === 0) {
            // 当前页面为商品或商品子路由界面
            path = '/product';
        }
        const selectKey = path;
        const openKey = this.openKey;
        return (
            <Menu
                theme="dark"
                selectedKeys={[selectKey]}
                defaultOpenKeys={[openKey]}
                mode="inline"
            >
                {
                    this.menuNodes
                }
            </Menu>

        )
    }
}
export default withRouter(LeftNav);