import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import withTimeouts from './withTimeouts'
import Popup from './Popup'
import Button from './Button'

const withStyle = (Self) => styled(Self)`
  &.container {
    display: inline-flex;
  }
  ${Popup} {
    margin: 0 auto;
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
`

@withStyle
@withTimeouts
class Actions extends React.Component<any> {
  handleActionClick = (event) => {
    const { actions, timeout, clickInterval } = this.props
    const id = event.target.dataset.id
    const action = actions[id]
    timeout(() => {
      action.onClick(event)
    }, clickInterval)
  }

  renderContent = () => {
    const { className, actions, activeActionId } = this.props
    return (
      <ul className="content">
        {actions.map(({ src, title, onClick }, id) => (
          <li key={id}>
            <Button
              {...{
                className: classNames('action', {
                  'action--active': id === activeActionId,
                }),
                tabIndex: -1,
                'data-id': id,
                onClick: this.handleActionClick,
                size: 'small',
                title,
              }}
            >
              {src}
            </Button>
          </li>
        ))}
      </ul>
    )
  }

  render() {
    const { className } = this.props
    return (
      <div
        {...{
          className: classNames(className, 'container'),
        }}
      >
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
