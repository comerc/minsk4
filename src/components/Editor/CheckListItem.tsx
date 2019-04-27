import React from 'react'
import { ItemWrapper, CheckboxWrapper, ContentWrapper } from './CheckListItem.styled'

class CheckListItem extends React.Component {
  onChange = (event) => {
    const checked = event.target.checked
    const { editor, node } = this.props as any
    editor.setNodeByKey(node.key, { data: { checked } })
  }

  render() {
    const { attributes, children, node, readOnly } = this.props as any
    const checked = node.data.get('checked')
    return (
      <ItemWrapper {...attributes}>
        <CheckboxWrapper contentEditable={false}>
          <input type="checkbox" checked={checked} onChange={this.onChange} />
        </CheckboxWrapper>
        <ContentWrapper
          checked={checked}
          contentEditable={!readOnly}
          suppressContentEditableWarning
        >
          {children}
        </ContentWrapper>
      </ItemWrapper>
    )
  }
}

export default CheckListItem
