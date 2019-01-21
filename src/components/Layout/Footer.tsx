import React, { Component } from 'react'
import styled from 'styled-components'
import Copyright from 'src/components/Copyright'

const style = () => (Self) => styled(Self)`
  ${Copyright} {
  }
`

@style()
class Footer extends Component {
  render() {
    const { className } = this.props as any
    return (
      <div className={className}>
        <Copyright />
      </div>
    )
  }
}

export default Footer
