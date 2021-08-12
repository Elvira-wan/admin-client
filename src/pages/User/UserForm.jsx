import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Input,
    Select,
} from 'antd'

const { Option } = Select;

export default class UserForm extends Component {
    static propTypes = {
        roleList: PropTypes.array,
        user: PropTypes.object,
        visible: PropTypes.bool
    }
    formRef = React.createRef();
    getInitForm = () => {
        const {username, phone, email, role_id} = this.props.user;
        this.formRef.current.setFieldsValue({
            username, phone, email, role_id
        })

    }
    componentDidMount() {
        this.getInitForm();
    }
    render() {
        const {user, roleList} = this.props;
        return (
            <Form
                labelCol={{
                    span: 4,
                }}
                wrapperCol={{
                    span: 10,
                }}
                ref={this.formRef}>
                <Form.Item
                    label="用户名"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: '必须输入用户名',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                {
                    !user._id ? (
                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '必须输入密码',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    ) : null
                }
                <Form.Item
                    label="手机号"
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: '必须输入手机号',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="邮箱"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: '必须输入邮箱',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="角色"
                    name="role_id"
                >
                    <Select style={{ width: 120 }} allowClear>
                        {
                            roleList.map(role => (
                                <Option value={role._id} key={role._id}>{role.name}</Option>
                            ))
                        }
                    </Select>
                </Form.Item>
            </Form>
        )
    }
}
