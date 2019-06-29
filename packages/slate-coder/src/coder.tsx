import React from 'react'
import classNames from 'classnames'
import Prism from 'prismjs'
import CodeBlock from './CodeBlock'

const coder = (options: any = {}) => {
  const { nodeType = 'code', hasLines = false } = options
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
    if (node.type === nodeType) {
      return <CodeBlock {...props} />
    }
    return next()
  }
  const renderDecoration = (props, editor, next) => {
    const { children, decoration, attributes } = props
    if (decoration.type === 'prism-token') {
      return (
        <span
          {...{
            ...attributes,
            className: decoration.data.get('className'),
          }}
        >
          {children}
        </span>
      )
    }
    return next()
  }
  const decorateNode = (node, editor, next) => {
    const others = next() || []
    if (node.type !== nodeType) return others
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
      const newlines = hasLines ? content.split('\n').length - 1 : 0
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
        const decoration = {
          type: 'prism-token',
          data: { className: classNames('prism-token token', token.type, token.alias) },
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
        decorations.push(decoration)
      }
      start = end
    }
    return [...others, ...decorations]
  }
  return {
    renderBlock,
    renderDecoration,
    decorateNode,
  }
}

export default coder
