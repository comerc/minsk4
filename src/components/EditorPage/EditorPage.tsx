import React from 'react'
import styled from 'styled-components'
import { Input, Select } from 'antd'
import Editor from 'src/components/Editor'

const { Option } = Select

const withStyle = (Self) => styled(Self)`
  ${Editor} {
    margin-top: 8px;
  }
  .language {
    min-width: 100px;
  }
`

@withStyle
class EditorPage extends React.Component<any> {
  filterOption = (input, option) => {
    return (option.props.children as any).toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  render() {
    const { className } = this.props
    return (
      <div className={className}>
        <Select
          {...{
            className: 'language',
            defaultValue: 'none',
            showSearch: true,
            dropdownMatchSelectWidth: false,
            optionFilterProp: 'children',
            filterOption: this.filterOption,
          }}
        >
          <Option value="none">(none)</Option>
          <Option value="js">JavaScript</Option>
          <Option value="html">HTML</Option>
        </Select>
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
