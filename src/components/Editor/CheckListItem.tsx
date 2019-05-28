import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import { Checkbox } from 'antd'

const withStyle = (Self) => styled(Self)`
  display: flex;
  align-items: center;
  .checkbox-wrapper {
    position: absolute;
    display: flex;
    margin-left: 2px;
  }
  .content-wrapper {
    margin-left: 22px;
    opacity: 1;
    text-decoration: none;
    &.checked {
      opacity: 0.65;
      text-decoration: line-through;
    }
  }
  .ant-checkbox-inner::after {
    font-size: 0;
  }
`

@withStyle
class CheckListItem extends React.Component<any> {
  handleChange = (event) => {
    const { readOnly, editor, node } = this.props
    if (readOnly) {
      return
    }
    const checked = event.target.checked
    editor
      .focus()
      .moveToRangeOfNode(node)
      .moveToEnd()
      .setNodeByKey(node.key, { data: { checked } })
  }

  render() {
    const {
      className,
      attributes: { className: externalClassName, ...attributes },
      children,
      node,
    } = this.props
    const checked = node.data.get('checked')
    return (
      <div {...attributes} className={classNames(externalClassName, className)}>
        <span className="checkbox-wrapper" contentEditable={false}>
          <Checkbox
            {...{
              checked,
              onChange: this.handleChange,
              tabIndex: -1,
            }}
          />
        </span>
        <span className={classNames('content-wrapper', { checked })}>{children}</span>
      </div>
    )
  }
}

export default CheckListItem
