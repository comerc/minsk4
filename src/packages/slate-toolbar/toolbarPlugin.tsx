import React from 'react'
// import styled, { withTheme } from 'styled-components'
import classNames from 'classnames'
// import Container from './Container'
import Toolbar from './Toolbar'

const toolbarPlugin = (options: any = {}) => {
  let { theme = {} } = options
  const decorateNode = (node, editor, next) => {
    const others = next() || []
    // console.log({ node, others })
    return [...others]
  }
  const renderNode = (props, _editor, next) => {
    // console.log('renderNode', props)
    if (props.isFocused) {
      props.attributes.className = classNames(props.attributes.className, 'ce-block--focused')
    }
    return next()
  }
  const renderEditor = (props, editor, next) => {
    // console.log('renderEditor', editor)
    const children = next()
    return <Toolbar {...{ editor, theme }}>{children}</Toolbar>
  }
  return { decorateNode, renderNode, renderEditor }
}

export default toolbarPlugin
