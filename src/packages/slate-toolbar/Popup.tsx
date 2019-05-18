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
  display: inline-flex;
  &.ant-tooltip {
    max-width: none;
  }
  .ant-tooltip-arrow {
    width: ${sqrtArrowWidth}px !important;
    height: ${sqrtArrowWidth}px !important;
    border-width: ${sqrtArrowWidth / 2}px !important;
    transform: rotate(45deg);
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
      right: ${arrowIndentX}px !important;
      bottom: ${arrowIndentY}px !important;
      box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.07);
    }
    .ant-tooltip-inner::before {
      right: ${arrowIndentX}px;
      bottom: -${arrowIndentY}px;
      border-right-color: ${({ theme }) => theme.popoverBg};
      border-bottom-color: ${({ theme }) => theme.popoverBg};
    }
  }
  &.ant-tooltip-placement-bottomRight {
    .ant-tooltip-arrow {
      right: ${arrowIndentX}px !important;
      top: ${arrowIndentY}px !important;
      box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.06);
    }
    .ant-tooltip-inner::before {
      right: ${arrowIndentX}px;
      top: -${arrowIndentY}px;
      border-top-color: ${({ theme }) => theme.popoverBg};
      border-left-color: ${({ theme }) => theme.popoverBg};
    }
  }
  &.ant-tooltip-placement-top {
    .ant-tooltip-arrow {
      bottom: ${arrowIndentY}px !important;
      box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.07);
    }
    .ant-tooltip-inner::before {
      bottom: -${arrowIndentY}px;
      left: 50%;
      margin-left: -5px;
      border-right-color: ${({ theme }) => theme.popoverBg};
      border-bottom-color: ${({ theme }) => theme.popoverBg};
    }
  }
`

@withStyle
class Popup extends React.Component<any> {
  isNeedToRenderContent = false

  shouldComponentUpdate(nextProps) {
    if (nextProps.visible) {
      this.isNeedToRenderContent = true
    }
    return true
  }

  componentDidUpdate(prevProps, prevState) {
    const { visible } = this.props
    if (visible !== prevProps.visible && prevProps.visible) {
      // it is need for animation before invisible state
      this.isNeedToRenderContent = false
    }
  }

  render() {
    const { className, overlayClassName, renderContent, ...rest } = this.props
    return (
      <div className={className}>
        <Tooltip
          {...{
            overlayClassName: classNames(overlayClassName, className),
            title: this.isNeedToRenderContent ? renderContent() : <React.Fragment />,
            ...rest,
          }}
        />
      </div>
    )
  }
}

export default Popup
