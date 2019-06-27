import React from 'react'
import styled, { withTheme } from 'styled-components'
import { Editor as SlateEditor } from 'slate-react'
import { Block, Value } from 'slate'
import controls from 'slate-controls'
import placeholder from './placeholder'
import Paragraph from './Paragraph'
import Task from './Task'
import Code from './Code'
import initialValueAsJson from './value.json'
import { ReactComponent as TasksIcon } from 'src/icons/octicon-tasklist.svg'
import { ReactComponent as ImageIcon } from 'src/icons/ce-image.svg'
import { ReactComponent as ListIcon } from 'src/icons/octicon-list-unordered.svg'
import { ReactComponent as DummyIcon } from 'src/icons/ce-header.svg'
import { ReactComponent as PlusIcon } from 'src/icons/ce-plus.svg'
import { ReactComponent as MoreIcon } from 'src/icons/outline-more_vert-24px.svg'
import { ReactComponent as ArrowUpIcon } from 'src/icons/ce-arrow-up.svg'
import { ReactComponent as DeleteIcon } from 'src/icons/ce-plus.svg'
import { ReactComponent as ArrowDownIcon } from 'src/icons/ce-arrow-down.svg'
import { ReactComponent as BoldIcon } from 'src/icons/ce-bold.svg'
import { ReactComponent as ItalicIcon } from 'src/icons/ce-italic.svg'
// import { ReactComponent as UnderlinedIcon } from 'src/icons/fa-underline.svg'
import { ReactComponent as CodeIcon } from 'src/icons/ce-code.svg'
import { ReactComponent as MarkerIcon } from 'src/icons/ce-marker.svg'

const withStyle = (Self) => styled(Self)``

const schema = {
  document: {
    nodes: [{ min: 1 }],
    normalize: (editor, { code, node, child, index }) => {
      const handlers = {
        child_type_invalid: () => {
          const type = 'paragraph'
          editor.setNodeByKey(child.key, type)
        },
        child_min_invalid: () => {
          const type = 'paragraph'
          const block = Block.create(type)
          editor.insertNodeByKey(node.key, index, block)
        },
      }
      const handler = handlers[code]
      if (handler) {
        handler()
      }
    },
  },
}

const other = () => {
  const renderNode = (props, editor, next) => {
    const { node } = props
    const renders = {
      paragraph: () => <Paragraph {...props} />,
      task: () => <Task {...props} />,
      code: () => <Code {...props} />,
    }
    const render = renders[node.type]
    if (render) {
      return render()
    }
    return next()
  }
  const onKeyDown = (event, editor, next) => {
    const { value } = editor
    if (event.key === 'Enter' && value.startBlock.type === 'task') {
      event.preventDefault()
      editor.splitBlock().setBlocks({ data: { checked: false } })
      return
    }
    if (event.key === 'Enter' && value.startBlock.type === 'code') {
      event.preventDefault()
      editor.insertText('\n')
      return
    }
    if (
      event.key === 'Backspace' &&
      value.selection.isCollapsed &&
      value.startBlock.type === 'task' &&
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
          src: <BoldIcon />,
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
          src: <ItalicIcon />,
          title: 'Italic',
          onClick: function(editor) {
            editor.toggleMark(this.type)
          },
          renderMark: ({ attributes, children }) => {
            return <em {...attributes}>{children}</em>
          },
        },
        // {
        //   type: 'underlined',
        //   src: <UnderlinedIcon />,
        //   title: 'Underlined',
        //   onClick: function(editor) {
        //     editor.toggleMark(this.type)
        //   },
        //   renderMark: ({ attributes, children }) => {
        //     return <u {...attributes}>{children}</u>
        //   },
        // },
        {
          type: 'code',
          src: <CodeIcon />,
          title: 'Code',
          onClick: function(editor) {
            editor.toggleMark(this.type)
          },
          renderMark: ({ attributes, children }) => {
            return <code {...attributes}>{children}</code>
          },
        },
        {
          type: 'marker',
          src: <MarkerIcon />,
          title: 'Marker',
          onClick: function(editor) {
            editor.toggleMark(this.type)
          },
          renderMark: ({ attributes, children }) => {
            return <mark {...attributes}>{children}</mark>
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
        task: [
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
        code: [
          {
            src: <DummyIcon />,
            title: 'Action #3',
            onClick: () => {
              console.log('Action #3')
            },
          },
        ],
      },
      tools: [
        {
          src: <CodeIcon />,
          title: 'Code',
          onClick: (editor) => {
            editor.setBlocks({ type: 'code', data: { syntax: null } })
          },
        },
        {
          src: <TasksIcon />,
          title: 'Tasks',
          onClick: (editor) => {
            editor.setBlocks({ type: 'task', data: { checked: false } })
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
