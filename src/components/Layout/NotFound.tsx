import React, { Component } from 'react'
import styled from 'styled-components'

const style = () => (Self) => styled(Self)``

@style()
class NotFound extends Component {
  render() {
    const { className } = this.props as any
    return <div className={className}>Not Found</div>
  }
}

export default NotFound
