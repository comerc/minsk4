import React, { Component } from 'react'
import _ from 'lodash'
import styled from 'styled-components'

const style = () => (Self) => styled(Self)``

@style()
class Header extends Component {
  render() {
    const { className } = _.get(this, 'props')
    return <div className={className}>Header</div>
  }
}

export default Header
