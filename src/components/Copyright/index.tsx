import React, { Component } from 'react'
import styled from 'styled-components'

const style = () => (Self) => styled(Self)``

@style()
class Copyright extends Component {
  render() {
    const { className } = this.props as any
    return <div className={className}>© {new Date().getFullYear()} MyCompany</div>
  }
}

export default Copyright
