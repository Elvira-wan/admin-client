import React, { Component } from 'react';
import {
    Card,
    Cascader,
    Form,
    Input,
    message,
} from 'antd';
import {
    ArrowLeftOutlined
} from '@ant-design/icons'
// 引入请求方式
import {
    reqCategory
} from '../../api/index'

export default class ProductAddUpdate extends Component {
    state = {
        options: []        // 级联下拉框的一级下拉列表
    }

    // 从详情页回退到home
    handleBack = () => {
        console.log(this.props)
        this.props.history.goBack();
    }

    // 初始化级联列表
    initOptions = async (data) => {
        // 初始化一级级联
        const options = data.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false       // 是否是叶子节点，无法判断其是否有子类，因此统一设置为有
        }))
        // 解决修改商品时二级级联列表不默认显示的问题
        const { product, isUpdate } = this;
        const {pCategoryId} = product;
        // 若为修改商品且商品处于二级分类下
        if (isUpdate && pCategoryId !== '0') {
            // 异步获取二级分类级联
            const subData = await this.getCategory(pCategoryId);
            // debugger;
            if (subData && subData.length > 0) {
                const subCategory = subData.map(c => ({
                    value: c._id,
                    name: c.name,
                    isLeaf: true
                }))
                // 找到对应的targetOption，并存入对应子级联
                const targetOption = options.find(category => category.value === pCategoryId);
                targetOption.children = subCategory;
            }
            // 更新状态
        }
        this.setState({ options }, () => {
            console.log(this.state)
        })
    }
    // 获取所有一级或二级分类
    getCategory = async (parentId) => {
        const { data } = await reqCategory(parentId);
        // 说明该分类为一级分类
        if (parentId === '0') {
            this.initOptions(data);
        } else {
            // 返回二级分类列表(作为async函数的Promise对象成功的返回值)
            return data;
        }
    }
    // 级联输入框: 选择某个分类时的回调  
    loadData = async selectedOptions => {
        // 为确定点击的目标option，其值为存储在渲染数组中的值
        // 则可知value为category的Id值
        const targetOption = selectedOptions[0];
        // 点击后的加载效果
        targetOption.loading = true;

        // 异步发送请求 获取二级列表
        // 此时getCategory为一个async函数，返回值为 一个Promise，因此使用await接收
        const subData = await this.getCategory(targetOption.value);
        targetOption.loading = false    // 隐藏 loading
        // 若有子分类
        if (subData && subData.length > 0) {
            // 生成一个二级option
            const subCategory = subData.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            // 将二级option与当前点击一级option绑定
            targetOption.children = subCategory;
        } else {
            // 无子分类：改变其isLeaf属性
            targetOption.isLeaf = true;
        }
        // 更新option状态
        this.setState({ options: [...this.state.options] }, () => {
            console.log(this.state)
        })
    };

    UNSAFE_componentWillMount() {
        const product = this.props.location.state;
        this.product = product || {};
        this.isUpdate = !!product;  // !!xxx 将一个数据强制转化成布尔类型值
    }
    componentDidMount() {
        this.getCategory('0')
    }
    render() {
        const { product, isUpdate } = this;
        const { pCategoryId, categoryId, imgs, detail } = product;
        const {options} = this.state;

        // 准备用于级联列表显示的数组
        const categoryIds = [];
        if (isUpdate) {
            // 若当前商品为一级分类
            if (pCategoryId === '0') {
                categoryIds.push(categoryId);
            } else {
                categoryIds.push(pCategoryId);
                categoryIds.push(categoryId);
            }
        }

        const title = (
            <>
                <ArrowLeftOutlined className='backArrow' onClick={this.handleBack} />
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </>
        )

        return (
            <Card title={title}>
                <Form
                    labelCol={{
                        span: 2,
                    }}
                    wrapperCol={{
                        span: 10,
                    }}
                    labelAlign='left'
                >
                    <Form.Item
                        label="商品名称"
                        name='name'
                        initialValue={product.name}
                        rules={[
                            {
                                required: true,
                                message: '请输入商品名称！',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="商品描述"
                        name='desc'
                        initialValue={product.desc}
                        rules={[
                            {
                                required: true,
                                message: '请输入商品描述！',
                            },
                        ]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        label="商品价格"
                        name='price'
                        initialValue={product.price}
                        rules={[
                            {
                                required: true,
                                message: '请输入商品价格！',
                            }, {
                                min: 0,
                                message: '价格必须为有效数字！'
                            }
                        ]}
                    >
                        <Input type='number' prefix="￥" suffix="RMB" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label="商品分类"
                        name='categoryIds'
                        initialValue={categoryIds}
                        rules={[
                            {
                                required: true,
                                message: '请输入商品名称！',
                            },
                        ]}
                    >
                        <Cascader
                            options={this.state.options}
                            loadData={this.loadData}
                        />
                    </Form.Item>
                </Form>
            </Card>
        )
    }
}
