import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'

const style = () => (Self) => styled(Self)`
  display: flex;
  flex-direction: row;
  align-items: center;
  & + & {
    margin-top: 0;
  }
  .checkbox-wrapper {
    margin-right: 0.75em;
  }
  .content-wrapper {
    flex: 1;
    opacity: 1;
    text-decoration: none;
    &.checked {
      opacity: 0.62;
      text-decoration: line-through;
    }
    &:focus {
      outline: none;
    }
  }
`

@style()
class CheckListItem extends React.Component {
  handleChange = (event) => {
    const { editor, node } = this.props as any
    const checked = event.target.checked
    editor.setNodeByKey(node.key, { data: { checked } })
  }

  render() {
    const { className, attributes, children, node, readOnly } = this.props as any
    const checked = node.data.get('checked')
    return (
      <div {...attributes} className={className}>
        <span className="checkbox-wrapper" contentEditable={false}>
          <input
            {...{
              type: 'checkbox',
              checked,
              onChange: this.handleChange,
            }}
          />
        </span>
        <span
          {...{
            className: classNames('content-wrapper', { checked }),
            contentEditable: !readOnly,
            suppressContentEditableWarning: true,
          }}
        >
          {children}
        </span>
      </div>
    )
  }
}

export default CheckListItem
