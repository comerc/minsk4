import React, { Component } from 'react'
import styled from 'styled-components'
import { Form, Input, Button } from 'antd'
import { formCreate } from 'src/utilities'

const style = () => (Self) => styled(Self)`
  .text {
    white-space: pre-wrap;
    border: 2px solid red;
  }
`

@formCreate()
@style()
class EditPostPage extends Component {
  handleSubmit = (event) => {
    event.preventDefault()
    const { form } = this.props as any
    form.validateFields((error, values) => {
      if (!error) {
        console.log('Received values of form: ', values)
      }
    })
  }

  render() {
    const {
      className,
      item: { title, text },
      form: { getFieldDecorator },
    } = this.props as any
    return (
      <Form
        {...{
          className,
          onSubmit: this.handleSubmit,
          hideRequiredMark: true,
        }}
      >
        <Form.Item label="Title">
          {getFieldDecorator('title', {
            rules: [{ message: 'Please enter title' }],
            initialValue: title,
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Text">
          {getFieldDecorator('text', {
            rules: [{ required: true, message: 'Please enter text' }],
            initialValue: text,
          })(<Input.TextArea />)}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

export default EditPostPage
