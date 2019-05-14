import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import { Tooltip as AntdTooltip } from 'antd'

const withStyle = (Self) => styled(Self)`
  display: inline-flex;
  &.ant-tooltip {
    pointer-events: none;
  }
`

@withStyle
class Tooltip extends React.Component<any> {
  render() {
    const { className, overlayClassName, ...rest } = this.props
    console.log(className, overlayClassName)
    return (
      <div className={className}>
        <AntdTooltip
          {...{
            overlayClassName: classNames(className, overlayClassName),
            ...rest,
          }}
        />
      </div>
    )
  }
}

export default Tooltip
