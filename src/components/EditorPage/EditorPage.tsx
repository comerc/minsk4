import React from 'react'
import styled from 'styled-components'
import { Input } from 'antd'
import Editor from 'src/components/Editor'

const withStyle = (Self) => styled(Self)``

@withStyle
class EditorPage extends React.Component<any> {
  render() {
    const { className } = this.props
    return (
      <div className={className}>
        <Input.TextArea
          {...{
            autosize: true,
            defaultValue: 'My new title',
          }}
        />
        <Editor />
      </div>
    )
  }
}

export default EditorPage
