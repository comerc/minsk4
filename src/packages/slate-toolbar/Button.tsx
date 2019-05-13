import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'

const withStyle = (Self) => styled(Self)`
  color: ${({ theme }) => theme.textColor};
  background-color: ${({ theme }) => theme.white};
  width: ${({ theme }) => theme.toolbarButtonWidth};
  height: ${({ theme }) => theme.toolbarButtonHeight};
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  &&:hover,
  &&.--active {
    color: ${({ theme }) => theme.primaryColor};
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
    const { className, isActive, onClick, children } = this.props
    return (
      <div
        {...{
          className: classNames(className, { '--active': isActive }),
          onClick,
          children,
        }}
      />
    )
  }
}

export default Button
