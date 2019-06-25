import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import withTimeout from 'react-timeout'
import Popup from './Popup'
import Button from './Button'

const withStyle = (Self) => styled(Self)`
  &.container {
    display: inline-flex;
    pointer-events: none;
  }
  &.ant-tooltip-placement-topRight {
    padding-bottom: 0;
  }
  &.ant-tooltip-placement-bottomRight {
    padding-top: 0;
  }
  .ant-tooltip-arrow {
    display: none;
  }
  .ant-tooltip-inner {
    &::before {
      content: none;
    }
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
    width: 17px;
    height: 17px;
    padding: 0 1px;
    color: ${({ theme }) => theme.textColor};
    background-color: transparent;
    border-radius: 50%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    transition: color 0.3s ease-in-out;
    cursor: pointer;
    pointer-events: initial;
    &:hover:not(.active) {
      color: ${({ theme }) => theme.primaryColor};
    }
    svg {
      fill: currentColor;
      pointer-events: none;
    }
  }
`

@withStyle
@withTimeout
class More extends React.Component<any> {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.isVisiblePopup && prevState.isConfirmDelete) {
      return { isConfirmDelete: false }
    }
    return null
  }

  state = { isVisiblePopup: false, isConfirmDelete: false }
  alignPopup = { offset: [11, 0] }
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
      clickInterval,
    } = this.props
    const prevNode = document.getPreviousNode(focusBlock.key)
    const newIndex = document.nodes.indexOf(prevNode)
    this.props.setTimeout(() => {
      // TODO: replace callbacks to promises
      onMoveBlockClick((callback) => {
        this.setState({ isVisiblePopup: false })
        editor.moveNodeByKey(focusBlock.key, document.key, newIndex)
        this.props.setTimeout(() => {
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
      clickInterval,
    } = this.props
    this.props.setTimeout(() => {
      this.setState({ isVisiblePopup: false })
      const firstNode = document.nodes.get(0)
      const isFirstNode = firstNode.key === focusBlock.key
      if (isFirstNode && document.nodes.size === 2) {
        const lastNode = document.nodes.get(1)
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
      clickInterval,
    } = this.props
    const nextNode = document.getNextNode(focusBlock.key)
    const newIndex = document.nodes.indexOf(nextNode)
    this.props.setTimeout(() => {
      onMoveBlockClick((callback) => {
        this.setState({ isVisiblePopup: false })
        editor.moveNodeByKey(focusBlock.key, document.key, newIndex)
        this.props.setTimeout(() => {
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
      ArrowUpIcon,
      DeleteIcon,
      ArrowDownIcon,
    } = this.props
    const { isConfirmDelete } = this.state
    const prevNode = document.getPreviousNode(focusBlock.key)
    const isArrowUpDisabled = !prevNode || prevNode.type === 'title'
    const nextNode = document.getNextNode(focusBlock.key)
    const isArrowDownDisabled = !nextNode
    const firstNode = document.nodes.get(0)
    const isDeleteDisabled =
      document.nodes.size === 1 && firstNode.type === 'paragraph' && firstNode.text === ''
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
    const { className, MoreIcon } = this.props
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
              className: classNames('button', { active: isVisiblePopup }),
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
