import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import { Tooltip } from 'antd'
import Popup from './Popup'
import Button from './Button'

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
class Actions extends React.Component<any> {
  handleActionClick = (event) => {
    const { actions, close, closeInterval } = this.props
    const id = event.target.dataset.id
    setTimeout(() => {
      close()
      actions[id].onClick(event)
    }, closeInterval)
  }

  renderContent = () => {
    const { className, actions, activeActionId } = this.props
    return (
      <ul className="content">
        {actions.map(({ src, alt, onClick }, id) => (
          <li key={id}>
            <Tooltip
              {...{
                overlayClassName: className,
                title: alt,
              }}
            >
              <Button
                {...{
                  className: classNames('action', {
                    'action--active': id === activeActionId,
                  }),
                  tabIndex: -1,
                  'data-id': id,
                  onClick: this.handleActionClick,
                  size: 'small',
                }}
              >
                {src}
              </Button>
            </Tooltip>
          </li>
        ))}
      </ul>
    )
  }

  render() {
    const {
      className,
      offsetY,
      isForcedHiddenPopup,
      isVisiblePopup,
      onVisiblePopupChange,
      children,
    } = this.props
    return (
      <div className={className}>
        <Popup
          {...{
            overlayClassName: classNames(className, {
              'ant-tooltip-hidden': isForcedHiddenPopup,
            }),
            trigger: 'focus',
            align: { offset: [0, offsetY] }, // TODO: memoize!
            visible: isVisiblePopup,
            onVisibleChange: onVisiblePopupChange,
            renderContent: this.renderContent,
          }}
        >
          <div>{children}</div>
        </Popup>
      </div>
    )
  }
}

export default Actions
