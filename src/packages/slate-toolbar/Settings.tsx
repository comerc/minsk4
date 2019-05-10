import React from 'react'
import styled from 'styled-components'
import { Tooltip, Button } from 'antd'

const arrowWidth = 6
const sqrtArrowWidth = Math.sqrt(arrowWidth * arrowWidth * 2)
const arrowTop = 4
const arrowRight = 16

const withStyle = (Self) => styled(Self)`
  .ant-tooltip-arrow {
    width: ${sqrtArrowWidth}px !important;
    height: ${sqrtArrowWidth}px !important;
    border-width: ${sqrtArrowWidth / 2}px !important;
    transform: rotate(45deg);
    top: ${arrowTop}px !important;
    right: ${arrowRight}px !important;
    border-top-color: transparent !important;
    border-right-color: transparent !important;
    border-bottom-color: transparent !important;
    border-left-color: transparent !important;
    box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.06);
  }
  .ant-tooltip-inner {
    color: ${({ theme }) => theme.popoverColor};
    background-color: ${({ theme }) => theme.popoverBg};
    background-clip: padding-box;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      top: -${arrowTop}px;
      right: ${arrowRight}px;
      width: ${sqrtArrowWidth}px;
      height: ${sqrtArrowWidth}px;
      border-width: ${sqrtArrowWidth / 2}px;
      border-style: solid;
      border-top-color: ${({ theme }) => theme.popoverBg};
      border-right-color: transparent;
      border-bottom-color: transparent;
      border-left-color: ${({ theme }) => theme.popoverBg};
      transform: rotate(45deg);
    }
  }
`

@withStyle
class Settings extends React.Component<any> {
  handleClick = (event) => {
    // event.preventDefault()
  }

  render() {
    const { className, children } = this.props
    return (
      <Tooltip
        {...{
          overlayClassName: className,
          placement: 'bottomRight',
          trigger: 'click',
          align: { offset: [10, 0] },
          title: (
            <div>
              1212121
              <br />
              <Button tabIndex={-1} onClick={this.handleClick} size="small">
                ...
              </Button>
              <Button tabIndex={-1} onClick={this.handleClick} size="small">
                ...
              </Button>
            </div>
          ),
          children,
        }}
      />
    )
  }
}

export default Settings
