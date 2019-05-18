import React from 'react'
// import styled, { withTheme } from 'styled-components'
import classNames from 'classnames'
import idx from 'idx'
import Toolbar from './Toolbar'

const toolbarPlugin = (options: any = {}) => {
  let { theme = {}, getActions = () => ({}), getTools = () => [], closeInterval = 200 } = options
  const decorateNode = (node, editor, next) => {
    const others = next() || []
    // console.log({ node, others })
    return [...others]
  }
  const renderNode = (props, editor, next) => {
    props.attributes.className = classNames(props.attributes.className, {
      'block--focused': props.isFocused && props.key === idx(editor.value.focusBlock, (_) => _.key),
      'block--title': props.node.type === 'title',
    })
    return next()
  }
  const renderEditor = (props, editor, next) => {
    // console.log('renderEditor', props)
    const { value } = props
    const children = next()
    return (
      <Toolbar
        {...{
          editor,
          theme,
          getActions,
          getTools,
          closeInterval,
          value,
        }}
      >
        {children}
      </Toolbar>
    )
  }
  return { decorateNode, renderNode, renderEditor }
}

export default toolbarPlugin
