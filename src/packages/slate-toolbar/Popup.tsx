import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import { Tooltip } from 'antd'
import Button from './Button'

const arrowWidth = 6
const sqrtArrowWidth = Math.sqrt(arrowWidth * arrowWidth * 2)
const arrowIndentY = 4 // TODO: почему? 6 внутри Antd Popconfirm
const arrowIndentX = 16

const withStyle = (Self) => styled(Self)`
  &.ant-tooltip {
    max-width: none;
  }
  .ant-tooltip-arrow {
    width: ${sqrtArrowWidth}px !important;
    height: ${sqrtArrowWidth}px !important;
    border-width: ${sqrtArrowWidth / 2}px !important;
    transform: rotate(45deg);
    right: ${arrowIndentX}px !important;
    border-color: transparent !important;
  }
  .ant-tooltip-inner {
    color: ${({ theme }) => theme.popoverColor};
    background-color: ${({ theme }) => theme.popoverBg};
    background-clip: padding-box;
    position: relative;
    display: inline-flex;
    &::before {
      content: '';
      position: absolute;
      right: ${arrowIndentX}px;
      width: ${sqrtArrowWidth}px;
      height: ${sqrtArrowWidth}px;
      border-width: ${sqrtArrowWidth / 2}px;
      border-style: solid;
      border-color: transparent;
      transform: rotate(45deg);
    }
  }
  &.ant-tooltip-placement-topRight {
    .ant-tooltip-arrow {
      bottom: ${arrowIndentY}px !important;
      box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.07);
    }
    .ant-tooltip-inner::before {
      bottom: -${arrowIndentY}px;
      border-right-color: ${({ theme }) => theme.popoverBg};
      border-bottom-color: ${({ theme }) => theme.popoverBg};
    }
  }
  &.ant-tooltip-placement-bottomRight {
    .ant-tooltip-arrow {
      top: ${arrowIndentY}px !important;
      box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.06);
    }
    .ant-tooltip-inner::before {
      top: -${arrowIndentY}px;
      border-top-color: ${({ theme }) => theme.popoverBg};
      border-left-color: ${({ theme }) => theme.popoverBg};
    }
  }
`

@withStyle
class Popup extends React.Component<any> {
  state = { visible: this.props.visible }
  isNeedToRenderContent = false

  close = () => {
    // it is need for animation before invisible state
    setTimeout(() => {
      this.isNeedToRenderContent = false
    })
    this.setState({ visible: false })
    const { onVisibleChange } = this.props
    if (onVisibleChange) {
      onVisibleChange(false)
    }
  }

  open = () => {
    this.isNeedToRenderContent = true
    this.setState({ visible: true })
    const { onVisibleChange } = this.props
    if (onVisibleChange) {
      onVisibleChange(true)
    }
  }

  handleVisibleChange = (visible) => {
    if (visible) {
      this.open()
    } else {
      this.close()
    }
  }

  componentDidUpdate(prevProps) {
    const { bodyWidth } = this.props
    if (bodyWidth !== prevProps.bodyWidth) {
      // TODO: Tooltip не способен определять новое положение
      this.close()
    }
  }

  render() {
    const { className, overlayClassName, renderContent, children, ...rest } = this.props
    const { visible } = this.state
    const popup = { open: this.open, close: this.close }
    const renderChildren = children as Function
    return (
      <div className={className}>
        <Tooltip
          {...{
            overlayClassName: classNames(overlayClassName, className),
            title: this.isNeedToRenderContent ? renderContent(popup) : <React.Fragment />,
            ...rest,
            visible,
            onVisibleChange: this.handleVisibleChange,
          }}
        >
          {renderChildren({ visible })}
        </Tooltip>
      </div>
    )
  }
}

export default Popup
