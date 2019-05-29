import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import withTimeouts from 'src/packages/react-timeouts'
import Popup from './Popup'
import Button from './Button'

const withStyle = (Self) => styled(Self)`
  &.container {
    display: inline-flex;
    transform: translate3d(${({ positionX }) => positionX}px, ${({ positionY }) => positionY}px, 0);
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
class Highlights extends React.Component<any> {
  renderContent = () => {
    const { className } = this.props
    return (
      <ul className="content">
        <li>
          <Button
            {...{
              tabIndex: -1,
              onClick: (event) => {
                event.preventDefault()
              },
              size: 'small',
            }}
          >
            X
          </Button>
        </li>
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

export default Highlights
