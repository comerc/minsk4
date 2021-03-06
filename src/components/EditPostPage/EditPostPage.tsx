import React from 'react'
import styled from 'styled-components'
import { Form, Input, Button } from 'antd'

const withStyle = (Self) => styled(Self)`
  .text {
    white-space: pre-wrap;
    border: 2px solid red;
  }
`

const formCreate = Form.create as any

@withStyle
@formCreate()
class EditPostPage extends React.Component<any> {
  handleSubmit = (event) => {
    event.preventDefault()
    const { form } = this.props
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
    } = this.props
    return (
      <Form
        {...{
          className,
          onSubmit: this.handleSubmit,
          hideRequiredMark: true,
        }}
      >
        <Form.Item>
          {/* {getFieldDecorator('dummy', {
            rules: [{ required: true, message: 'Please enter text' }],
            initialValue: text,
          })(
          )} */}
        </Form.Item>
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
