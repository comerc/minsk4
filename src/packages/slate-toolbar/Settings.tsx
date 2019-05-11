import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import { Tooltip, Button } from 'antd'
import { ReactComponent as ArrowUpIcon } from './icons/ce-arrow-up.svg'
import { ReactComponent as DeleteIcon } from './icons/ce-plus.svg'
import { ReactComponent as ArrowDownIcon } from './icons/ce-arrow-down.svg'

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
    border-color: transparent !important;
    box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.06);
  }
  .ant-tooltip-inner {
    color: ${({ theme }) => theme.popoverColor};
    background-color: ${({ theme }) => theme.popoverBg};
    background-clip: padding-box;
    position: relative;
    padding: 0;
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
  .container {
    width: ${({ theme }) => theme.settingsWidth};
    .plugin-zone {
      display: inline-flex;
      flex-wrap: wrap;
    }
    .plugin-zone:not(:empty) {
      padding: 6px 8px 0;
    }
    .default-zone {
      display: inline-flex;
      flex-wrap: nowrap;
    }
    .default-zone:not(:empty) {
      padding: 6px 8px;
    }
  }
  .ant-btn {
    width: ${({ theme }) => theme.toolboxButtonsSize};
    height: ${({ theme }) => theme.toolboxButtonsSize};
    display: inline-flex;
    justify-content: center;
    align-items: center;
    &:not(:nth-child(3n + 3)) {
      margin-right: 8px;
    }
    &:nth-child(n + 4) {
      margin-top: 6px;
    }
    svg {
      fill: currentColor;
    }
  }
  .delete {
    svg {
      transform: rotate(45deg);
    }
  }
`

@withStyle
class Settings extends React.Component<any> {
  state = { isConfirm: false }

  handleArrowUpClick = (event) => {
    event.preventDefault()
  }

  handleDeleteClick = (event) => {
    event.preventDefault()
    const { isConfirm } = this.state
    if (isConfirm) {
      this.setState({ isConfirm: false })
      const { editor } = this.props
      editor.removeNodeByKey(editor.value.focusBlock.key)
    } else {
      this.setState({ isConfirm: true })
    }
  }

  handleArrowDownClick = (event) => {
    event.preventDefault()
  }

  render() {
    const { className, children } = this.props
    const { isConfirm } = this.state
    return (
      <Tooltip
        {...{
          overlayClassName: className,
          placement: 'bottomRight',
          trigger: 'click',
          align: { offset: [10, 0] },
          title: (
            <div className="container">
              <div className="plugin-zone" />
              <div className="default-zone">
                <Button
                  {...{
                    tabIndex: -1,
                    onClick: this.handleArrowUpClick,
                    size: 'small',
                  }}
                >
                  <ArrowUpIcon />
                </Button>
                <Button
                  {...{
                    className: 'delete',
                    tabIndex: -1,
                    onClick: this.handleDeleteClick,
                    size: 'small',
                    type: isConfirm ? 'danger' : 'default',
                  }}
                >
                  <DeleteIcon />
                </Button>
                <Button
                  {...{
                    tabIndex: -1,
                    onClick: this.handleArrowDownClick,
                    size: 'small',
                  }}
                >
                  <ArrowDownIcon />
                </Button>
              </div>
            </div>
          ),
          children,
        }}
      />
    )
  }
}

export default Settings
