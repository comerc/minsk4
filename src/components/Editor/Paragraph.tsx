import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'

const withStyle = (Self) => styled(Self)`
  .dummy-wrapper {
    position: absolute;
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
    // FIXED: выделение текстового блока тройным кликом - <span>&#65279;</span>
    return (
      <p {...attributes} className={classNames(externalClassName, className)}>
        <span className="dummy-wrapper">&#65279;</span>
        {children}
      </p>
    )
  }
}

export default Paragraph
