import React from 'react'
// import styled, { withTheme } from 'styled-components'
import classNames from 'classnames'
import Container from './Container'
import Wrapper from './Container'

const toolbarPlugin = (options: any = {}) => {
  let { theme = {} } = options
  const decorateNode = (node, editor, next) => {
    const others = next() || []
    // console.log({ node, others })
    return [...others]
  }
  const renderNode = (props, _editor, next) => {
    // console.log('renderNode', props)
    if (props.isSelected) {
      props.attributes.className = classNames(props.attributes.className, 'editor-block--selected')
    }
    return next()
  }
  const renderEditor = (props, editor, next) => {
    // console.log('renderEditor', props)
    const { value } = props
    const children = next()
    return <Container {...{ editor, theme, value }}>{children}</Container>
  }

  return { decorateNode, renderNode, renderEditor }
}

export default toolbarPlugin
