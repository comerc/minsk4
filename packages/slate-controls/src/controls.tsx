import React from 'react'
import classNames from 'classnames'
import Editor from './Editor'

const controls = (options: any = {}) => {
  let {
    theme = {},
    highlights = [],
    tools = [],
    actionsByType = {},
    clickInterval = 200,
    icons = {},
  } = options
  console.log(icons)
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
  const renderNode = (props, editor, next) => {
    if (!props.readOnly && props.isFocused) {
      const { focusBlock } = editor.value
      const focusBlockKey = focusBlock && focusBlock.key
      props.attributes.className = classNames(props.attributes.className, {
        'block--focused': props.key === focusBlockKey,
      })
    }
    return next()
  }
  const renderEditor = (props, editor, next) => {
    // console.log('renderEditor', props)
    const { value } = props
    const children = next()
    return (
      <Editor
        {...{
          theme,
          editor,
          highlights,
          tools,
          actionsByType,
          clickInterval,
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
  return { decorateNode, renderMark, renderNode, renderEditor, onSelect }
}

export default controls
