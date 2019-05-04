import React from 'react'
import styled from 'styled-components'

const withStyle = (Self) => styled(Self)``

@withStyle
class Container extends React.Component<any> {
  render() {
    const { className, children } = this.props
    return <div className={className}>{children}</div>
  }
}

export default Container
