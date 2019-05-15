import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import { Block } from 'slate'
import Popup from './Popup'
import Button from './Button'
import { ReactComponent as ArrowUpIcon } from './icons/ce-arrow-up.svg'
import { ReactComponent as DeleteIcon } from './icons/ce-plus.svg'
import { ReactComponent as ArrowDownIcon } from './icons/ce-arrow-down.svg'

const withStyle = (Self) => styled(Self)`
  ul.content {
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
    border-radius: 4px;
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
class More extends React.Component<any> {
  state = { isConfirmDelete: false }
  isButtonMouseDown = false
  popup = null as any

  close = () => {
    if (this.popup) {
      this.popup.close()
    }
  }

  open = () => {
    if (this.popup) {
      this.popup.open()
    }
  }

  handleVisibleChange = (visible) => {
    if (!visible) {
      this.setState({ isConfirmDelete: false })
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
      closeInterval,
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
    const {
      editor,
      editor: {
        value: { focusBlock, document },
      },
      closeInterval,
    } = this.props
    setTimeout(() => {
      this.close()
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
      closeInterval,
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

  renderContent = (popup) => {
    this.popup = popup
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
      <ul className="content">
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

  renderButton = ({ visible }) => {
    const { children } = this.props
    return (
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
    )
  }

  componentWillUnmount() {
    this.popup = null
  }

  render() {
    const { className, bodyWidth } = this.props
    return (
      <div className={className}>
        <Popup
          {...{
            overlayClassName: className,
            placement: 'topRight',
            trigger: 'click',
            align: { offset: [6, 0] },
            onVisibleChange: this.handleVisibleChange,
            renderContent: this.renderContent,
            bodyWidth,
          }}
        >
          {this.renderButton}
        </Popup>
      </div>
    )
  }
}

export default More
