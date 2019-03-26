import { Form } from 'antd'

export const formCreate = (options = {}) => (Self) => Form.create(options)(Self) as any
