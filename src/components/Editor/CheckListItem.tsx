import React from 'react'
import styled, { css } from 'styled-components'

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
    opacity: ${(props) => (props.node.data.get('checked') ? 0.62 : 1)};
    text-decoration: ${(props) => (props.node.data.get('checked') ? 'line-through' : 'none')};
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
            className: 'content-wrapper',
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
