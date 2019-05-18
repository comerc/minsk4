import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import { Tooltip } from 'antd'
import Popup from './Popup'
import Button from './Button'

const withStyle = (Self) => styled(Self)`
  display: inline-flex;
  margin: 0 auto;
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
    const { actions, closeInterval } = this.props
    const id = event.target.dataset.id
    const action = actions[id]
    setTimeout(() => {
      action.onClick(event)
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
    const { className } = this.props
    return (
      <div className={className}>
        <Popup
          {...{
            overlayClassName: className,
            visible: true,
            renderContent: this.renderContent,
          }}
        />
      </div>
    )
  }
}

export default Actions
