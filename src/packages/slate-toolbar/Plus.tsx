import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import Popup from './Popup'
import Button from './Button'
import { ReactComponent as PlusIcon } from './icons/ce-plus.svg'

const withStyle = (Self) => styled(Self)`
  display: inline-flex;
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
  .button {
    &--x {
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
  }
  .tool {
    width: ${({ theme }) => '72px'};
    height: 64px;
    font-size: ${({ theme }) => theme.fontSizeSm};
    border: none;
    box-shadow: none;
    background-color: transparent;
    svg {
      width: 32px;
      height: 32px;
    }
    &--active {
      color: ${({ theme }) => theme.primaryColor};
      border-color: ${({ theme }) => theme.primaryColor};
    }
  }
`

@withStyle
class Plus extends React.Component<any> {
  alignPopup = { offset: [this.props.theme.toolbarButtonWidth, -5] }
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
    const { tools, close, closeInterval } = this.props
    const id = event.target.dataset.id
    setTimeout(() => {
      close()
      tools[id].onClick(event)
    }, closeInterval)
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
                  'tool--active': id === activeToolId,
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
    const { className, theme, isVisiblePopup, onVisiblePopupChange } = this.props
    return (
      <div className={className}>
        <Popup
          {...{
            overlayClassName: className,
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
              className: classNames('button', {
                'button--x': isVisiblePopup,
              }),
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
