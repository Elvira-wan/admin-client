import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd'

import menuList from '../../config/menuConfig.jsx'

const { SubMenu } = Menu;

class LeftNav extends Component {
    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname;
        return menuList.map(item => {
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
        })
    }
    // 在组件初次挂载之前调用函数渲染画面
    UNSAFE_componentWillMount() {
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