import React from 'react'
import { Editor } from 'slate-react'
import { Block, Value } from 'slate'
import placeholder from './placeholder'
import initialValueAsJson from './value.json'

const initialValue = Value.fromJSON(initialValueAsJson)

const schema = {
  document: {
    nodes: [{ match: { type: 'title' }, min: 1, max: 1 }, { match: { type: 'paragraph' }, min: 1 }],
    normalize: (editor, { code, node, child, index }) => {
      switch (code) {
        case 'child_type_invalid': {
          const type = index === 0 ? 'title' : 'paragraph'
          return editor.setNodeByKey(child.key, type)
        }
        case 'child_min_invalid': {
          const block = Block.create(index === 0 ? 'title' : 'paragraph')
          return editor.insertNodeByKey(node.key, index, block)
        }
      }
    },
  },
}

class MainEditor extends React.Component {
  render() {
    return (
      <Editor
        defaultValue={initialValue}
        schema={schema}
        renderNode={this.renderNode}
        plugins={[
          placeholder({ type: 'title', placeholder: 'Enter a title...' }),
          placeholder({ type: 'paragraph', placeholder: 'Enter a text...' }),
        ]}
      />
    )
  }

  renderNode = (props, _editor, next) => {
    const { attributes, children, node } = props

    switch (node.type) {
      case 'title':
        return <h2 {...attributes}>{children}</h2>
      case 'paragraph':
        return <p {...attributes}>{children}</p>
      default:
        return next()
    }
  }
}

export default MainEditor
