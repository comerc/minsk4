import React from 'react'
import styled from 'styled-components'

const withStyle = (Self) => styled(Self)`
  color: ${({ theme }) => theme.grayText};
  cursor: pointer;
  width: ${({ theme }) => theme.toolboxButtonsSize};
  height: ${({ theme }) => theme.toolboxButtonsSize};
  display: inline-flex;
  justify-content: center;
  align-items: center;
  &:hover,
  &--active {
    color: ${({ theme }) => theme.colorActiveIcon};
  }
  &--active {
    animation: bounceIn 0.75s 1;
    animation-fill-mode: forwards;
  }
`

@withStyle
class Button extends React.Component<any> {
  render() {
    const { className, onClick, externalRef, children } = this.props
    return (
      <div
        {...{
          className,
          onClick,
          ref: externalRef,
        }}
      >
        {children}
      </div>
    )
  }
}

export default Button
