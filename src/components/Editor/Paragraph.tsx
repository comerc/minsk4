import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'

const withStyle = (Self) => styled(Self)`
  display: flex;
  .content-wrapper {
    flex-grow: 1;
  }
`

@withStyle
class Paragraph extends React.Component<any> {
  render() {
    const {
      className,
      attributes: { className: externalClassName, ...attributes },
      children,
      readOnly,
    } = this.props
    // FIXED: выделение текстового блока тройным кликом - { display: 'flex' } + <span>&#65279;</span>
    return (
      <p {...attributes} className={classNames(externalClassName, className)}>
        <span contentEditable={false}>&#65279;</span>
        <span
          {...{
            className: classNames('content-wrapper'),
            contentEditable: !readOnly,
            suppressContentEditableWarning: true,
          }}
        >
          {children}
        </span>
      </p>
    )
  }
}

export default Paragraph
