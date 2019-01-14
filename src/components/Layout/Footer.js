import React, { Component } from 'react'
import styled from 'styled-components'
import Copyright from 'src/components/Copyright'

class Footer extends Component {
  render() {
    const { className } = this.props
    return (
      <div className={className}>
        <Copyright className="aaa" />
      </div>
    )
  }
}

export default styled(Footer)`
  ${Copyright} {
  }
`
