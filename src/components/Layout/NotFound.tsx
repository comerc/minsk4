import React from 'react'
import styled from 'styled-components'

const withStyle = (Self) => styled(Self)``

@withStyle
class NotFound extends React.Component {
  render() {
    const { className } = this.props as any
    return <div className={className}>Not Found</div>
  }
}

export default NotFound
