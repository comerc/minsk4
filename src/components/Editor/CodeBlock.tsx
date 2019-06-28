import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import Prism from 'prismjs'

const withStyle = (Self) => styled(Self)``

@withStyle
class CodeBlock extends React.Component<any> {
  render() {
    const {
      className,
      attributes: { className: externalClassName, ...attributes },
      children,
    } = this.props
    return (
      <div
        {...{
          className: classNames(externalClassName, className),
        }}
      >
        <pre>
          <code {...attributes}>{children}</code>
        </pre>
      </div>
    )
  }
}

const plugin = (options: any = {}) => {
  const getContent = (token) => {
    if (typeof token === 'string') {
      return token
    } else if (typeof token.content === 'string') {
      return token.content
    } else {
      return token.content.map(getContent).join('')
    }
  }
  const renderBlock = (props, editor, next) => {
    const { node } = props
    // console.log('renderNode', node)
    if (node.type === 'code') {
      return <CodeBlock {...props} />
    }
    return next()
  }
  const renderDecoration = (props, editor, next) => {
    const { children, decoration, attributes } = props
    switch (decoration.type) {
      case 'comment':
        return (
          <span {...attributes} style={{ opacity: '0.33' }}>
            {children}
          </span>
        )
      case 'keyword':
        return (
          <span {...attributes} style={{ fontWeight: 'bold' }}>
            {children}
          </span>
        )
      case 'tag':
        return (
          <span {...attributes} style={{ fontWeight: 'bold' }}>
            {children}
          </span>
        )
      case 'punctuation':
        return (
          <span {...attributes} style={{ opacity: '0.75' }}>
            {children}
          </span>
        )
      default:
        return next()
    }
  }
  const onKeyDown = (event, editor, next) => {
    const { value } = editor
    if (event.key === 'Enter' && value.startBlock.type === 'code') {
      event.preventDefault()
      editor.insertText('\n')
      return
    }
    next()
  }
  const decorateNode = (node, editor, next) => {
    const others = next() || []
    if (node.type !== 'code') return others
    const language = node.data.get('language')
    if (!language) return others
    const texts = Array.from(node.texts())
    const string = texts.map(([n]: any) => n.text).join('\n')
    const grammar = Prism.languages[language]
    const tokens = Prism.tokenize(string, grammar)
    const decorations = [] as any
    let startEntry = texts.shift()
    let endEntry = startEntry
    let startOffset = 0
    let endOffset = 0
    let start = 0
    for (const token of tokens) {
      startEntry = endEntry
      startOffset = endOffset
      const [startText, startPath] = startEntry as any
      const content = getContent(token)
      const newlines = content.split('\n').length - 1
      const length = content.length - newlines
      const end = start + length
      let available = startText.text.length - startOffset
      let remaining = length
      endOffset = startOffset + remaining
      while (available < remaining && texts.length > 0) {
        endEntry = texts.shift()
        const [endText] = endEntry as any
        remaining = length - available
        available = endText.text.length
        endOffset = remaining
      }
      const [endText, endPath] = endEntry as any
      if (typeof token !== 'string') {
        const dec = {
          type: token.type,
          anchor: {
            key: startText.key,
            path: startPath,
            offset: startOffset,
          },
          focus: {
            key: endText.key,
            path: endPath,
            offset: endOffset,
          },
        }
        // console.log(dec)
        decorations.push(dec)
      }
      start = end
    }
    return [...others, ...decorations]
  }
  return {
    renderBlock,
    renderDecoration,
    onKeyDown,
    decorateNode,
  }
}

export default plugin
