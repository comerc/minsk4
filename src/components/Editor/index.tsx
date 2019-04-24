import React from 'react'
import styled from 'styled-components'
import { Editor } from 'slate-react'
import { Block, Value } from 'slate'
import sidebar from 'src/components/Sidebar'
import placeholder from './placeholder'
import initialValueAsJson from './value.json'

const style = () => (Self) => styled(Self)``

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

const renderNode = (props, _editor, next) => {
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

@sidebar()
class EditorContainer extends React.Component {
  // editor

  // ref = (editor) => (this.editor = editor)

  render() {
    return (
      <Editor
        {...{
          schema,
          renderNode,
          plugins: [
            placeholder({ type: 'title', placeholder: 'Title' }),
            placeholder({ type: 'paragraph', placeholder: 'Tell your story...' }),
          ],
          // ref: this.ref,
          ...this.props,
        }}
      />
    )
  }
}

@style()
class ControlledEditor extends React.Component {
  // state = {
  //   value: Value.fromJSON(initialValueAsJson),
  // }

  // handleChange = ({ value }) => this.setState({ value })

  render() {
    const { className } = this.props as any
    // const { value } = this.state
    return (
      <EditorContainer
        {...{
          className,
          defaultValue: Value.fromJSON(initialValueAsJson),
          // value,
          // onChange: this.handleChange,
        }}
      />
    )
  }
}

export default ControlledEditor
