import React from 'react'
import classNames from 'classnames'
import idx from 'idx'
import Editor from './Editor'

const toolbarPlugin = (options: any = {}) => {
  let { theme = {}, getTools = () => [], getActions = () => ({}), clickInterval = 200 } = options
  const decorateNode = (node, editor, next) => {
    const others = next() || []
    // console.log({ node, others })
    return [...others]
  }
  const renderNode = (props, editor, next) => {
    props.attributes.className = classNames(props.attributes.className, {
      'block--focused':
        props.isFocused && props.key === idx(editor.value.focusBlock, (self) => self.key),
    })
    return next()
  }
  const renderEditor = (props, editor, next) => {
    console.log('renderEditor', props)
    const { value } = props
    const children = next()
    return (
      <Editor
        {...{
          theme,
          editor,
          getTools,
          getActions,
          clickInterval,
          value,
        }}
      >
        {children}
      </Editor>
    )
  }
  const onSelect = (event, editor, next) => {
    console.log('onSelect')
    next()
  }
  return { decorateNode, renderNode, renderEditor, onSelect }
}

export default toolbarPlugin
