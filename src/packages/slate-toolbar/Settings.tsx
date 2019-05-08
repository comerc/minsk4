import React from 'react'
import styled from 'styled-components'
import { Tooltip } from 'antd'

const arrowWidth = 6
const sqrtArrowWidth = Math.sqrt(arrowWidth * arrowWidth * 2)

const withStyle = (Self) => styled(Self)`
  .ant-tooltip-arrow {
    width: ${sqrtArrowWidth}px !important;
    height: ${sqrtArrowWidth}px !important;
    border-width: ${sqrtArrowWidth / 2}px !important;
    transform: rotate(45deg);
    top: 4px !important;
    border-top-color: #fff !important;
    border-right-color: transparent !important;
    border-bottom-color: transparent !important;
    border-left-color: #fff !important;
    box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.06);
  }
  .ant-tooltip-inner {
    color: rgba(0, 0, 0, 0.65);
    background-color: #fff;
    background-clip: padding-box;
  }
`

@withStyle
class Settings extends React.Component<any> {
  render() {
    const { className, children } = this.props
    return (
      <Tooltip
        {...{
          overlayClassName: className,
          placement: 'bottom',
          trigger: 'click',
          align: { offset: [0, 0] },
          title: (
            <div>
              121
              <br />
              212
            </div>
          ),
          children,
        }}
      />
    )
  }
}

export default Settings
