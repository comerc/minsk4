import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import Popup from './Popup'
import Button from './Button'
import { ReactComponent as ArrowUpIcon } from './icons/ce-arrow-up.svg'
import { ReactComponent as DeleteIcon } from './icons/ce-plus.svg'
import { ReactComponent as ArrowDownIcon } from './icons/ce-arrow-down.svg'
import { ReactComponent as MoreIcon } from './icons/outline-more_horiz-24px.svg'

const withStyle = (Self) => styled(Self)`
  display: inline-flex;
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
    width: 24px;
    height: 15px;
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
      pointer-events: none;
    }
  }
`

@withStyle
class More extends React.Component<any> {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.isVisiblePopup && prevState.isConfirmDelete) {
      return { isConfirmDelete: false }
    }
    return null
  }

  state = { isVisiblePopup: false, isConfirmDelete: false }
  alignPopup = { offset: [8, 0] }
  isButtonMouseDown = false

  open = () => {
    this.setState({ isVisiblePopup: true })
  }

  close = () => {
    this.setState({ isVisiblePopup: false })
  }

  handlePopupVisibleChange = (visible) => {
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
      clickInterval,
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
    }, clickInterval)
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
      clickInterval,
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
    }, clickInterval)
  }

  handleArrowDownClick = (event) => {
    const {
      editor,
      editor: {
        value: { focusBlock, document },
      },
      onMove,
      clickInterval,
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
    }, clickInterval)
  }

  renderContent = () => {
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

  render() {
    const { className } = this.props
    const { isVisiblePopup } = this.state
    return (
      <div className={className}>
        <Popup
          {...{
            overlayClassName: className,
            placement: 'bottomRight',
            trigger: 'click',
            align: this.alignPopup,
            visible: isVisiblePopup,
            onVisibleChange: this.handlePopupVisibleChange,
            renderContent: this.renderContent,
          }}
        >
          <div
            {...{
              className: classNames('button', { 'button--open': isVisiblePopup }),
              onMouseDown: this.handleButtonMouseDown,
              onMouseUp: this.handleButtonMouseUp,
              role: 'button',
            }}
          >
            <MoreIcon />
          </div>
        </Popup>
      </div>
    )
  }
}

export default More
