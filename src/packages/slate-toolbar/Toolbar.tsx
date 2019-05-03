import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'

const withStyle = (Self) => styled(Self)`
  .ce-block--focused {
    background-image: linear-gradient(
      17deg,
      rgba(243, 248, 255, 0.03) 63.45%,
      rgba(207, 214, 229, 0.27) 98%
    );
    border-radius: 3px;
  }
`

@withStyle
class Toolbar extends React.Component<any> {
  render() {
    const { className, children } = this.props as any
    return (
      <div className={className}>
        <div
          className={classNames('ce-toolbar', {
            // 'ce-toolbar--opened': focusBlock && !isReadOnly,
          })}
        />
        {children}
      </div>
    )
  }
}

export default Toolbar
