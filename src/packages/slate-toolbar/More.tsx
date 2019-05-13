import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import classNames from 'classnames'
import { Block } from 'slate'
import { Tooltip } from 'antd'
import Button from './Button'
import { ReactComponent as ArrowUpIcon } from './icons/ce-arrow-up.svg'
import { ReactComponent as DeleteIcon } from './icons/ce-plus.svg'
import { ReactComponent as ArrowDownIcon } from './icons/ce-arrow-down.svg'

const arrowWidth = 6
const sqrtArrowWidth = Math.sqrt(arrowWidth * arrowWidth * 2)
const arrowIndentY = 4
const arrowIndentX = 20
const closeInterval = 200

const withStyle = (Self) => styled(Self)`
  &&.ant-tooltip {
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
  &&.ant-tooltip-placement-topRight {
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
  &&.ant-tooltip-placement-bottomRight {
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
  ul.container {
    margin: 0;
    padding: 0;
    display: inline-flex;
    li {
      display: inline-flex;
    }
    li:not(:last-child) {
      margin-right: 6px;
    }
  }
  .delete {
    svg {
      transform: rotate(45deg);
    }
  }
  .button {
    width: 28px;
    height: 17px;
    padding: 0 4px;
    color: ${({ theme }) => theme.black};
    background-color: ${({ theme }) => theme.white};
    opacity: 0.65;
    border-radius: 2px;
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    &:hover,
    &--open {
      opacity: 1;
      color: ${({ theme }) => theme.textColor};
    }
    svg {
      fill: currentColor;
    }
  }
`

@withStyle
class Settings extends React.Component<any> {
  state = { visible: false, isConfirmDelete: false }
  isNeedToRenderContainer = false
  isButtonMouseDown = false

  close = () => {
    // it is need for animation before invisible state
    setTimeout(() => {
      this.isNeedToRenderContainer = false
    })
    this.setState({ visible: false, isConfirmDelete: false })
  }

  open = () => {
    this.isNeedToRenderContainer = true
    this.setState({ visible: true })
  }

  handleVisibleChange = (visible) => {
    if (visible) {
      this.open()
    } else {
      this.close()
    }
  }

  handleButtonMouseDown = (event) => {
    this.isButtonMouseDown = true
  }

  handleButtonMouseUp = (event) => {
    if (this.isButtonMouseDown) {
      this.isButtonMouseDown = false
    } else {
      this.open()
    }
  }

  handleArrowUpClick = (event) => {
    const {
      editor,
      editor: {
        value: { focusBlock, document },
      },
      onMove,
    } = this.props
    const prevNode = document.getPreviousNode(focusBlock.key)
    const newIndex = document.nodes.indexOf(prevNode)
    setTimeout(() => {
      this.close()
      editor.moveNodeByKey(focusBlock.key, document.key, newIndex)
      setTimeout(() => {
        onMove()
        this.open()
      })
    }, closeInterval)
  }

  handleDeleteClick = (event) => {
    const { isConfirmDelete } = this.state
    if (!isConfirmDelete) {
      this.setState({ isConfirmDelete: true })
      return
    }
    setTimeout(() => {
      this.close()
      const {
        editor,
        editor: {
          value: { focusBlock, document },
        },
      } = this.props
      const hasTitle = document.nodes.get(0).type === 'title'
      const isFirstNode = document.nodes.indexOf(focusBlock) === (hasTitle ? 1 : 0)
      if (isFirstNode && document.nodes.size === (hasTitle ? 3 : 2)) {
        const lastNode = document.nodes.get(hasTitle ? 2 : 1)
        if (lastNode.type === 'paragraph' && lastNode.text === '') {
          // fixed placeholder
          editor.removeNodeByKey(focusBlock.key).removeNodeByKey(lastNode.key)
          return
        }
      }
      editor.removeNodeByKey(focusBlock.key)
    }, closeInterval)
  }

  handleArrowDownClick = (event) => {
    const {
      editor,
      editor: {
        value: { focusBlock, document },
      },
      onMove,
    } = this.props
    const nextNode = document.getNextNode(focusBlock.key)
    const newIndex = document.nodes.indexOf(nextNode)
    setTimeout(() => {
      this.close()
      editor.moveNodeByKey(focusBlock.key, document.key, newIndex)
      setTimeout(() => {
        onMove()
        this.open()
      })
    }, closeInterval)
  }

  renderContainer = () => {
    const {
      editor: {
        value: { focusBlock, document },
      },
    } = this.props
    const { isConfirmDelete } = this.state
    const prevNode = document.getPreviousNode(focusBlock.key)
    const isArrowUpDisabled = !prevNode || prevNode.type === 'title'
    const nextNode = document.getNextNode(focusBlock.key)
    const isArrowDownDisabled = !nextNode
    const hasTitle = document.nodes.get(0).type === 'title'
    const firstNode = document.nodes.get(hasTitle ? 1 : 0)
    const isDeleteDisabled =
      document.nodes.size === (hasTitle ? 2 : 1) &&
      firstNode.type === 'paragraph' &&
      firstNode.text === ''
    return (
      <ul className="container">
        <li>
          <Button
            {...{
              tabIndex: -1,
              onClick: this.handleArrowUpClick,
              size: 'small',
              disabled: isArrowUpDisabled,
            }}
          >
            <ArrowUpIcon />
          </Button>
        </li>
        <li>
          <Button
            {...{
              className: 'delete',
              tabIndex: -1,
              onClick: this.handleDeleteClick,
              size: 'small',
              disabled: isDeleteDisabled,
              type: isConfirmDelete ? 'danger' : 'default',
            }}
          >
            <DeleteIcon />
          </Button>
        </li>
        <li>
          <Button
            {...{
              tabIndex: -1,
              onClick: this.handleArrowDownClick,
              size: 'small',
              disabled: isArrowDownDisabled,
            }}
          >
            <ArrowDownIcon />
          </Button>
        </li>
      </ul>
    )
  }

  componentDidUpdate(prevProps) {
    const { bodyWidth } = this.props
    if (bodyWidth !== prevProps.bodyWidth) {
      // TODO: Tooltip не способен определять новое положение
      this.close()
    }
  }

  render() {
    const { className, children } = this.props
    const { visible } = this.state
    return (
      <div className={className}>
        <Tooltip
          {...{
            overlayClassName: className,
            placement: 'topRight',
            trigger: 'click',
            align: { offset: [10, 0] },
            visible,
            onVisibleChange: this.handleVisibleChange,
            title: this.isNeedToRenderContainer ? this.renderContainer() : <React.Fragment />,
          }}
        >
          <div
            {...{
              className: classNames('button', { 'button--open': visible }),
              onMouseDown: this.handleButtonMouseDown,
              onMouseUp: this.handleButtonMouseUp,
              role: 'button',
            }}
          >
            {children}
          </div>
        </Tooltip>
      </div>
    )
  }
}

export default Settings
