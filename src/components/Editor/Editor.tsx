import React from 'react'
import styled, { withTheme } from 'styled-components'
import { Editor as SlateEditor } from 'slate-react'
import { Block, Value } from 'slate'
import controls from 'slate-controls'
import placeholder from './placeholder'
import CheckListItem from './CheckListItem'
import Paragraph from './Paragraph'
import initialValueAsJson from './value.json'
import { ReactComponent as TasksIcon } from 'src/icons/ce-code.svg'
import { ReactComponent as ImageIcon } from 'src/icons/ce-image.svg'
import { ReactComponent as ListIcon } from 'src/icons/ce-list.svg'
import { ReactComponent as DummyIcon } from 'src/icons/ce-header.svg'
import { ReactComponent as PlusIcon } from 'src/icons/ce-plus.svg'
import { ReactComponent as MoreIcon } from 'src/icons/outline-more_vert-24px.svg'
import { ReactComponent as ArrowUpIcon } from 'src/icons/ce-arrow-up.svg'
import { ReactComponent as DeleteIcon } from 'src/icons/ce-plus.svg'
import { ReactComponent as ArrowDownIcon } from 'src/icons/ce-arrow-down.svg'

const withStyle = (Self) => styled(Self)``

const schema = {
  document: {
    nodes: [{ match: [{ type: 'paragraph' }, { type: 'check_list_item' }], min: 1 }],
    normalize: (editor, { code, node, child, index }) => {
      const handlers = {
        child_type_invalid: () => {
          const type = 'paragraph'
          return editor.setNodeByKey(child.key, type)
        },
        child_min_invalid: () => {
          const type = 'paragraph'
          const block = Block.create(type)
          return editor.insertNodeByKey(node.key, index, block)
        },
      }
      const handler = handlers[code]
      if (handler) {
        return handler()
      }
    },
  },
}

const other = () => {
  const renderNode = (props, editor, next) => {
    const { node } = props
    const renders = {
      paragraph: () => <Paragraph {...props} />,
      check_list_item: () => <CheckListItem {...props} />,
    }
    const render = renders[node.type]
    if (render) {
      return render()
    }
    return next()
  }
  const onKeyDown = (event, editor, next) => {
    const { value } = editor
    if (event.key === 'Enter' && value.startBlock.type === 'check_list_item') {
      event.preventDefault()
      editor.splitBlock().setBlocks({ data: { checked: false } })
      return
    }
    if (
      event.key === 'Backspace' &&
      value.selection.isCollapsed &&
      value.startBlock.type === 'check_list_item' &&
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

@withTheme
@withStyle
class Editor extends React.Component<any> {
  plugins = [
    placeholder({ type: 'paragraph', placeholder: 'Tell your story...' }),
    controls({
      theme: this.props.theme,
      highlights: [
        {
          type: 'bold',
          src: 'B',
          title: 'Bold',
          onClick: function(editor) {
            editor.toggleMark(this.type)
          },
          renderMark: ({ attributes, children }) => {
            return <strong {...attributes}>{children}</strong>
          },
        },
        {
          type: 'italic',
          src: 'I',
          title: 'Italic',
          onClick: function(editor) {
            editor.toggleMark(this.type)
          },
          renderMark: ({ attributes, children }) => {
            return <em {...attributes}>{children}</em>
          },
        },
        {
          type: 'underlined',
          src: 'U',
          title: 'Underlined',
          onClick: function(editor) {
            editor.toggleMark(this.type)
          },
          renderMark: ({ attributes, children }) => {
            return <u {...attributes}>{children}</u>
          },
        },
        {
          type: 'code',
          src: 'C',
          title: 'Code',
          onClick: function(editor) {
            editor.toggleMark(this.type)
          },
          renderMark: ({ attributes, children }) => {
            return <code {...attributes}>{children}</code>
          },
        },
      ],
      actionsByType: {
        paragraph: [
          {
            src: <DummyIcon />,
            title: 'Action #0',
            onClick: (editor) => {
              console.log('Action #0', editor.value.toJSON())
            },
          },
        ],
        check_list_item: [
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
      },
      tools: [
        {
          src: <TasksIcon />,
          title: 'Check List',
          onClick: (editor) => {
            editor.setBlocks({ type: 'check_list_item', data: { checked: false } })
          },
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
      icons: {
        PlusIcon,
        MoreIcon,
        ArrowUpIcon,
        DeleteIcon,
        ArrowDownIcon,
      },
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
