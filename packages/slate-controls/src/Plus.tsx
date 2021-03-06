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
    transform: ${({ focusBlockBoundOffset }) =>
      `translate3d(0, calc(${focusBlockBoundOffset}px - 50%), 0)`};
    animation: fadeIn 0.4s;
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  }
  &.ant-tooltip-placement-topLeft {
    padding-bottom: 0;
  }
  &.ant-tooltip-placement-bottomLeft {
    padding-top: 0;
  }
  .ant-tooltip-arrow {
    display: none;
  }
  .ant-tooltip-inner {
    max-width: 304px;
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
  }
  .button.x {
    svg {
      animation: spin 0.4s;
      animation-fill-mode: forwards;
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(45deg);
        }
      }
    }
  }
  .tool {
    width: 72px;
    height: 64px;
    font-size: ${({ theme }) => theme.fontSizeSm};
    border: none;
    box-shadow: none;
    background-color: transparent;
    svg {
      width: 32px;
      height: 32px;
    }
    &.active {
      color: ${({ theme }) => theme.primaryColor};
    }
  }
`

@withStyle
@withTimeout
class Plus extends React.Component<any> {
  alignPopup = { offset: this.props.popupOffset }
  // isButtonMouseDown = false

  // handleButtonMouseDown = (event) => {
  //   this.isButtonMouseDown = true
  // }

  // handleButtonMouseUp = (event) => {
  //   if (this.isButtonMouseDown) {
  //     this.isButtonMouseDown = false
  //   } else {
  //     const { open } = this.props
  //     open()
  //   }
  // }

  handleToolClick = (event) => {
    const { tools, onVisiblePopupChange, editor, clickInterval } = this.props
    const id = event.target.dataset.id
    this.props.setTimeout(() => {
      onVisiblePopupChange(false)
      tools[id].onClick(editor)
    }, clickInterval)
  }

  renderContent = () => {
    const { tools, activeToolId } = this.props
    return (
      <ul className="content">
        {tools.map(({ src, title, onClick }, id) => (
          <li key={id}>
            <Button
              {...{
                className: classNames('tool', {
                  active: id === activeToolId,
                }),
                tabIndex: -1,
                'data-id': id,
                onClick: this.handleToolClick,
              }}
            >
              {src}
              <span>{title}</span>
            </Button>
          </li>
        ))}
      </ul>
    )
  }

  render() {
    const { className, isHiddenPopup, isVisiblePopup, onVisiblePopupChange, PlusIcon } = this.props
    return (
      <div
        {...{
          className: classNames(className, 'container'),
        }}
      >
        <Popup
          {...{
            overlayClassName: classNames(className, { 'ant-tooltip-hidden': isHiddenPopup }),
            placement: 'bottomLeft',
            trigger: 'click',
            align: this.alignPopup,
            visible: isVisiblePopup,
            onVisibleChange: onVisiblePopupChange,
            renderContent: this.renderContent,
          }}
        >
          <Button
            {...{
              className: classNames('button', { x: isVisiblePopup }),
              size: 'small',
              shape: 'circle',
              // onMouseDown: this.handleButtonMouseDown,
              // onMouseUp: this.handleButtonMouseUp,
            }}
          >
            <PlusIcon />
          </Button>
        </Popup>
      </div>
    )
  }
}

export default Plus
