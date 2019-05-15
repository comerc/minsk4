import React from 'react'
// import styled, { withTheme } from 'styled-components'
import classNames from 'classnames'
import nanoid from 'nanoid'
import idx from 'idx'
import Toolbar from './Toolbar'

const toolbarPlugin = (options: any = {}) => {
  let { theme = {}, getTools = () => [], closeInterval = 200 } = options
  const focusedBlockClassName = `${nanoid(6)}_block--focused`
  const decorateNode = (node, editor, next) => {
    const others = next() || []
    // console.log({ node, others })
    return [...others]
  }
  const renderNode = (props, editor, next) => {
    // console.log('renderNode')
    if (props.node.type !== 'title' && props.key === idx(editor.value.focusBlock, (_) => _.key)) {
      props.attributes.className = classNames(props.attributes.className, focusedBlockClassName)
    }
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
          getTools,
          closeInterval,
          focusedBlockClassName,
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
