import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'

const withStyle = (Self) => styled(Self)``

@withStyle
class Paragraph extends React.Component<any> {
  render() {
    const {
      className,
      attributes: { className: externalClassName, ...attributes },
      children,
    } = this.props
    return (
      <p {...attributes} className={classNames(externalClassName, className)}>
        {children}
      </p>
    )
  }
}

export default Paragraph
