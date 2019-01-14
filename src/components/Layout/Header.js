import React, { Component } from 'react'
import styled from 'styled-components'

class Header extends Component {
  render() {
    const { className } = this.props
    return <div className={className}>Header</div>
  }
}

export default styled(Header)``
