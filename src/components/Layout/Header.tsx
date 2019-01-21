import React, { Component } from 'react'
import styled from 'styled-components'

const style = () => (Self) => styled(Self)``

@style()
class Header extends Component {
  render() {
    const { className } = this.props as any
    return <div className={className}>Header</div>
  }
}

export default Header
