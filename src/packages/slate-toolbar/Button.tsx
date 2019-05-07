import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'

const withStyle = (Self) => styled(Self)`
  color: ${({ theme }) => theme.grayText};
  cursor: pointer;
  width: ${({ theme }) => theme.toolboxButtonsSize};
  height: ${({ theme }) => theme.toolboxButtonsSize};
  display: inline-flex;
  justify-content: center;
  align-items: center;
  &&:hover,
  &&.--active {
    color: ${({ theme }) => theme.colorActiveIcon};
  }
  &&.--active {
    animation: bounceIn 0.75s;
    animation-fill-mode: forwards;
  }
  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
    }
  }
`

@withStyle
class Button extends React.Component<any> {
  render() {
    const { className, isActive, onClick, externalRef, children } = this.props
    return (
      <div
        {...{
          className: classNames(className, { '--active': isActive }),
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
