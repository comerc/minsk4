import React from 'react'
import styled from 'styled-components'
import { Tooltip, Button } from 'antd'

const arrowWidth = 6
const sqrtArrowWidth = Math.sqrt(arrowWidth * arrowWidth * 2)
const top = 4
const right = 16

const withStyle = (Self) => styled(Self)`
  .ant-tooltip-arrow {
    width: ${sqrtArrowWidth}px !important;
    height: ${sqrtArrowWidth}px !important;
    border-width: ${sqrtArrowWidth / 2}px !important;
    transform: rotate(45deg);
    top: ${top}px !important;
    right: ${right}px !important;
    border-top-color: transparent !important;
    border-right-color: transparent !important;
    border-bottom-color: transparent !important;
    border-left-color: transparent !important;
    box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.06);
  }
  .ant-tooltip-inner {
    color: rgba(0, 0, 0, 0.65);
    background-color: ${({ theme }) => theme.backgroundColor};
    background-clip: padding-box;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      top: -${top}px;
      right: ${right}px;
      width: ${sqrtArrowWidth}px;
      height: ${sqrtArrowWidth}px;
      background-color: ${({ theme }) => theme.backgroundColor};
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
