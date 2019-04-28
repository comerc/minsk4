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
  onChange = (event) => {
    const checked = event.target.checked
    const { editor, node } = this.props as any
    editor.setNodeByKey(node.key, { data: { checked } })
  }

  render() {
    const { className, attributes, children, node, readOnly } = this.props as any
    const checked = node.data.get('checked')
    return (
      <div {...attributes} className={className}>
        <span className="checkbox-wrapper" contentEditable={false}>
          <input type="checkbox" checked={checked} onChange={this.onChange} />
        </span>
        <span
          className="content-wrapper"
          contentEditable={!readOnly}
          suppressContentEditableWarning
        >
          {children}
        </span>
      </div>
    )
  }
}

export default CheckListItem
