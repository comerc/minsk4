import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import withTimeouts from './withTimeouts'
import Popup from './Popup'
import Button from './Button'
import { ReactComponent as ArrowUpIcon } from './icons/ce-arrow-up.svg'
import { ReactComponent as DeleteIcon } from './icons/ce-plus.svg'
import { ReactComponent as ArrowDownIcon } from './icons/ce-arrow-down.svg'
import { ReactComponent as MoreIcon } from './icons/outline-more_horiz-24px.svg'

const withStyle = (Self) => styled(Self)`
  &.container {
    display: inline-flex;
  }
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
    &--active {
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
@withTimeouts
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

  handlePopupVisibleChange = (visible) => {
    this.setState({ isVisiblePopup: visible })
  }

  handleButtonMouseDown = (event) => {
    this.isButtonMouseDown = true
  }

  handleButtonMouseUp = (event) => {
    if (this.isButtonMouseDown) {
      this.isButtonMouseDown = false
    } else {
      this.setState({ isVisiblePopup: true })
    }
  }

  handleArrowUpClick = (event) => {
    const {
      editor,
      editor: {
        value: { focusBlock, document },
      },
      onMoveBlockClick,
      timeout,
      clickInterval,
    } = this.props
    const prevNode = document.getPreviousNode(focusBlock.key)
    const newIndex = document.nodes.indexOf(prevNode)
    timeout(() => {
      // TODO: replace callbacks to promises
      onMoveBlockClick((callback) => {
        this.setState({ isVisiblePopup: false })
        editor.moveNodeByKey(focusBlock.key, document.key, newIndex)
        timeout(() => {
          callback()
          this.setState({ isVisiblePopup: true })
        })
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
      timeout,
      clickInterval,
    } = this.props
    timeout(() => {
      this.setState({ isVisiblePopup: false })
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
      onMoveBlockClick,
      timeout,
      clickInterval,
    } = this.props
    const nextNode = document.getNextNode(focusBlock.key)
    const newIndex = document.nodes.indexOf(nextNode)
    timeout(() => {
      onMoveBlockClick((callback) => {
        this.setState({ isVisiblePopup: false })
        editor.moveNodeByKey(focusBlock.key, document.key, newIndex)
        timeout(() => {
          callback()
          this.setState({ isVisiblePopup: true })
        })
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
      <div
        {...{
          className: classNames(className, 'container'),
        }}
      >
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
              className: classNames('button', { 'button--active': isVisiblePopup }),
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
