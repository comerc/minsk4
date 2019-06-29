import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'

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

export default CodeBlock
