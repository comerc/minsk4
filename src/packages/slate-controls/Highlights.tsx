import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import withTimeout from 'react-timeout'
import Popup from './Popup'
import Button from './Button'

// TODO: добавить смещение стрелки по краям выделенного текста

const withStyle = (Self) => styled(Self)`
  &.container {
    display: inline-flex;
    transform: ${({ left, top, theme: { highlightsOffsetY } }) =>
      `translate3d(${left}px, calc(${top}px + ${highlightsOffsetY}), 0)`};
  }
  ${Popup} {
    margin: 0 auto;
  }
  &.ant-tooltip-placement-top {
    padding-bottom: 0;
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
`

@withStyle
@withTimeout
class Highlights extends React.Component<any> {
  handleHighlightClick = (event) => {
    const { highlights, editor, clickInterval } = this.props
    const id = event.target.dataset.id
    this.props.setTimeout(() => {
      highlights[id].onClick(editor)
    }, clickInterval)
  }

  isActive = (type) => {
    const {
      editor: { value },
    } = this.props
    return value.activeMarks.some((mark) => mark.type === type)
  }

  renderContent = () => {
    const { highlights } = this.props
    return (
      <ul className="content">
        {highlights.map(({ type, src, title }, id) => (
          <li key={id}>
            <Button
              {...{
                tabIndex: -1,
                'data-id': id,
                onClick: this.handleHighlightClick,
                size: 'small',
                title,
                type: this.isActive(type) ? 'danger' : 'default',
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

export default Highlights
