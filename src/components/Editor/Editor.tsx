import React from 'react'
import styled, { withTheme } from 'styled-components'
import { Editor as SlateEditor } from 'slate-react'
import { Block, Value } from 'slate'
import toolbar from 'src/packages/slate-toolbar'
import placeholder from './placeholder'
import CheckListItem from './CheckListItem'
import initialValueAsJson from './value.json'
import { ReactComponent as TasksIcon } from 'src/icons/ce-code.svg'
import { ReactComponent as ImageIcon } from 'src/icons/ce-image.svg'
import { ReactComponent as ListIcon } from 'src/icons/ce-list.svg'
import { ReactComponent as DummyIcon } from 'src/icons/ce-header.svg'

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
  const onKeyDown = (event, editor, next) => {
    const { value } = editor
    if (event.key === 'Enter' && value.startBlock.type === 'title') {
      event.preventDefault()
      editor.moveToStartOfNextBlock()
      const firstNode = value.document.nodes.get(1)
      if (firstNode.type !== 'paragraph' || firstNode.text !== '') {
        editor.insertBlock('paragraph')
      }
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
    // TODO: how to check item without mouse?
    return next()
  }
  return { renderNode, onKeyDown }
}

const addCheckListItemBlock = (editor) => (event) => {
  editor.setBlocks({ type: 'check-list-item', data: { checked: false } })
}

@withTheme
@withStyle
class Editor extends React.Component<any> {
  plugins = [
    placeholder({ type: 'title', placeholder: 'Title' }),
    placeholder({ type: 'paragraph', placeholder: 'Tell your story...' }),
    toolbar({
      theme: this.props.theme,
      getActions: (editor) => ({
        paragraph: [
          {
            src: <DummyIcon />,
            title: 'Action #0',
            onClick: () => {
              console.log('Action #0')
            },
          },
        ],
        'check-list-item': [
          {
            src: <DummyIcon />,
            title: 'Action #1',
            onClick: () => {
              console.log('Action #1')
            },
          },
          {
            src: <DummyIcon />,
            title: 'Action #2',
            onClick: () => {
              console.log('Action #2')
            },
          },
        ],
      }),
      getTools: (editor) => [
        {
          src: <TasksIcon />,
          title: 'Check List',
          onClick: addCheckListItemBlock(editor),
        },
        {
          src: <ImageIcon />,
          title: 'Image',
          onClick: () => {},
        },
        {
          src: <ListIcon />,
          title: 'List',
          onClick: () => {},
        },
      ],
    }),
    // lists({
    //   blocks: {
    //     ordered_list: 'ordered-list',
    //     unordered_list: 'unordered-list',
    //     list_item: 'list-item',
    //   },
    //   classNames: {
    //     ordered_list: 'ordered-list',
    //     unordered_list: 'unordered-list',
    //     list_item: 'list-item',
    //   },
    // }),
    other(),
  ]

  render() {
    const { className } = this.props
    return (
      <SlateEditor
        {...{
          className,
          defaultValue: Value.fromJSON(initialValueAsJson),
          autoFocus: true,
          spellCheck: false,
          schema,
          plugins: this.plugins,
        }}
      />
    )
  }
}

export default Editor
