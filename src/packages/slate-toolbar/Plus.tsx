import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
// import { Block } from 'slate'
import Popup from './Popup'
import Button from './Button'
import { ReactComponent as PlusIcon } from './icons/ce-plus.svg'

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
`

@withStyle
class Plus extends React.Component<any> {
  isButtonMouseDown = false

  handleButtonMouseDown = (event) => {
    this.isButtonMouseDown = true
  }

  handleButtonMouseUp = (event) => {
    if (this.isButtonMouseDown) {
      this.isButtonMouseDown = false
    } else {
      const { open } = this.props
      open()
    }
  }

  renderContent = () => {
    return (
      <ul className="content">
        <li>content</li>
      </ul>
    )
  }

  render() {
    const {
      className,
      isVisiblePopup,
      onVisiblePopupChange,
      close,
      onClick,
      bodyWidth,
    } = this.props
    return (
      <div className={className}>
        <Popup
          {...{
            overlayClassName: className,
            placement: 'topRight',
            trigger: 'click',
            align: { offset: [8, -2] },
            visible: isVisiblePopup,
            onVisibleChange: onVisiblePopupChange,
            renderContent: this.renderContent,
            bodyWidth,
            close,
          }}
        >
          <Button
            {...{
              className: classNames('button', {
                'button--open': isVisiblePopup,
              }),
              size: 'small',
              shape: 'circle',
              onClick,
              onMouseDown: this.handleButtonMouseDown,
              onMouseUp: this.handleButtonMouseUp,
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
