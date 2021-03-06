import React from 'react'
import classNames from 'classnames'
import Editor from './Editor'

const controls = (options: any = {}) => {
  const {
    theme = {},
    highlights = [],
    tools = [],
    actionsByType = {},
    clickInterval = 200,
    plusPopupOffset = [24, -3],
    icons = {},
  } = options
  const decorateNode = (node, editor, next) => {
    const others = next() || []
    // console.log({ node, others })
    return [...others]
  }
  const renderMark = (props, editor, next) => {
    const { mark } = props
    const highlight = highlights.find(({ type }) => type === mark.type)
    if (highlight) {
      return highlight.renderMark(props, editor)
    }
    return next()
  }
  const renderBlock = (props, editor, next) => {
    if (!props.readOnly && props.isFocused) {
      const { focusBlock, focusText } = editor.value
      const focusBlockKey = focusBlock && focusBlock.key
      const isEmptyParagraph = focusBlock.type === 'paragraph' && focusText.text === ''
      props.attributes.className = classNames(props.attributes.className, {
        'focused-block': props.node.key === focusBlockKey && !isEmptyParagraph,
      })
    }
    return next()
  }
  const renderEditor = (props, editor, next) => {
    // console.log('renderEditor', props)
    const { value } = props
    // TODO: попробовать удалить value из props - можно ли заменить на editor.value?
    const children = next()
    // console.log(editor.value === value)
    return (
      <Editor
        {...{
          theme,
          editor,
          highlights,
          tools,
          actionsByType,
          clickInterval,
          plusPopupOffset,
          icons,
          value,
        }}
      >
        {children}
      </Editor>
    )
  }
  const onSelect = (event, editor, next) => {
    // console.log('onSelect')
    next()
  }
  return { decorateNode, renderMark, renderBlock, renderEditor, onSelect }
}

export default controls
