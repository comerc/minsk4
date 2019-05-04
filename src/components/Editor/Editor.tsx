import React from 'react'
import styled, { withTheme } from 'styled-components'
import _ from 'lodash'
import { Button } from 'antd'
import { Editor as SlateEditor } from 'slate-react'
import { Block, Value } from 'slate'
import sidebar from './sidebar'
import toolbar from 'src/packages/slate-toolbar'
import placeholder from './placeholder'
import CheckListItem from './CheckListItem'
import initialValueAsJson from './value.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTasks } from '@fortawesome/free-solid-svg-icons'

const withStyle = (Self) => styled(Self)``

const schema = {
  document: {
    nodes: [
      { match: { type: 'title' }, min: 1, max: 1 },
      { match: [{ type: 'paragraph' }, { type: 'check-list-item' }], min: 1 },
    ],
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

const other = () => {
  const renderNode = (props, _editor, next) => {
    const { attributes, children, node } = props
    switch (node.type) {
      case 'title':
        return <h2 {...attributes}>{children}</h2>
      case 'paragraph':
        return <p {...attributes}>{children}</p>
      case 'check-list-item':
        return <CheckListItem {...props} />
      // default:
    }
    return next()
  }

  return { renderNode }
}

const handleKeyDown = _.memoize((onKeyDown) => (event, editor, next) => {
  const { value } = editor
  if (event.key === 'Enter' && value.startBlock.type === 'title') {
    event.preventDefault()
    editor.moveToStartOfNextBlock()
    return
  }
  if (event.key === 'Enter' && value.startBlock.type === 'check-list-item') {
    event.preventDefault()
    editor.splitBlock().setBlocks({ data: { checked: false } })
    return
  }
  if (
    event.key === 'Backspace' &&
    value.selection.isCollapsed &&
    value.startBlock.type === 'check-list-item' &&
    value.selection.start.offset === 0
  ) {
    event.preventDefault()
    editor.setBlocks('paragraph')
    return
  }
  return onKeyDown(event, editor, next)
})

const addCheckListItemBlock = _.memoize((editor) => (event) => {
  event.preventDefault()
  editor.setBlocks({ type: 'check-list-item', data: { checked: false } }).focus()
})

// const sidebarOptions = {
//   // leftOffset: 10,
//   content: (editor) => (
//     <React.Fragment>
//       <Button onClick={addCheckListItemBlock(editor)}>
//         <FontAwesomeIcon icon="tasks" />
//       </Button>
//     </React.Fragment>
//   ),
// }

// @sidebar(sidebarOptions)
// class Container extends React.Component {
//   render() {
//     const { editorRef, onKeyDown, ...rest } = this.props as any
//     return (
//       <SlateEditor
//         {...{
//           autoFocus: true,
//           schema,
//           // renderNode,
//           plugins,
//           // ref: editorRef,
//           // onKeyDown: handleKeyDown(onKeyDown),
//           ...rest,
//         }}
//       />
//     )
//   }
// }

@withTheme
@withStyle
class Editor extends React.Component<any> {
  state = {
    value: Value.fromJSON(initialValueAsJson),
  }

  plugins = [
    placeholder({ type: 'title', placeholder: 'Title' }),
    placeholder({ type: 'paragraph', placeholder: 'Tell your story...' }),
    toolbar({ theme: this.props.theme }),
    other(),
  ]

  handleChange = ({ value }) => {
    this.setState({ value })
  }

  render() {
    const { className } = this.props
    const { value } = this.state
    return (
      <SlateEditor
        {...{
          className,
          value,
          onChange: this.handleChange,
          autoFocus: true,
          schema,
          plugins: this.plugins,
        }}
      />
    )
  }
}

export default Editor
