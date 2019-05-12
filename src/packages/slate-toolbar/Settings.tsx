import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import classNames from 'classnames'
import { Block } from 'slate'
import { Tooltip, Button } from 'antd'
import { ReactComponent as ArrowUpIcon } from './icons/ce-arrow-up.svg'
import { ReactComponent as DeleteIcon } from './icons/ce-plus.svg'
import { ReactComponent as ArrowDownIcon } from './icons/ce-arrow-down.svg'

const arrowWidth = 6
const sqrtArrowWidth = Math.sqrt(arrowWidth * arrowWidth * 2)
const arrowIndentY = 4
const arrowIndentX = 16

const withStyle = (Self) => styled(Self)`
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
    padding: 0;
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
  .container {
    /* TODO: remove plugin-zone */
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
  state = { visible: false, isConfirmDelete: false }
  isNeedToRenderContainer = false

  close = () => {
    this.setState({ visible: false, isConfirmDelete: false })
  }

  open = () => {
    this.setState({ visible: true })
  }

  handleVisibleChange = (visible) => {
    if (visible) {
      this.isNeedToRenderContainer = true
      this.open()
    } else {
      // it is need for animation before invisible state
      setTimeout(() => {
        this.isNeedToRenderContainer = false
      })
      this.close()
    }
  }

  handleArrowUpClick = (event) => {
    event.preventDefault()
    const {
      editor,
      editor: {
        value: { focusBlock, document },
      },
      onMove,
    } = this.props
    const prevNode = document.getPreviousNode(focusBlock.key)
    const newIndex = document.nodes.indexOf(prevNode)
    editor.moveNodeByKey(focusBlock.key, document.key, newIndex)
    this.close()
    setTimeout(() => {
      onMove()
      this.open()
    })
  }

  handleDeleteClick = (event) => {
    event.preventDefault()
    const { isConfirmDelete } = this.state
    if (!isConfirmDelete) {
      this.setState({ isConfirmDelete: true })
      return
    }
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
  }

  handleArrowDownClick = (event) => {
    event.preventDefault()
    const {
      editor,
      editor: {
        value: { focusBlock, document },
      },
      onMove,
    } = this.props
    const nextNode = document.getNextNode(focusBlock.key)
    const newIndex = document.nodes.indexOf(nextNode)
    editor.moveNodeByKey(focusBlock.key, document.key, newIndex)
    this.close()
    setTimeout(() => {
      onMove()
      this.open()
    })
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
      <div className="container">
        <div className="plugin-zone" />
        <div className="default-zone">
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
          <Button
            {...{
              className: 'delete',
              tabIndex: -1,
              onClick: this.handleDeleteClick,
              size: 'small',
              type: isConfirmDelete ? 'danger' : 'default',
              disabled: isDeleteDisabled,
            }}
          >
            <DeleteIcon />
          </Button>
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
        </div>
      </div>
    )
  }

  render() {
    const { className, children } = this.props
    const { visible } = this.state
    return (
      <div className={className}>
        <Tooltip
          {...{
            overlayClassName: className,
            placement: 'bottomRight',
            trigger: 'click',
            align: { offset: [10, 0] },
            visible,
            onVisibleChange: this.handleVisibleChange,
            title: this.isNeedToRenderContainer ? this.renderContainer() : <React.Fragment />,
            children,
          }}
        />
      </div>
    )
  }
}

export default Settings
