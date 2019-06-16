import React from 'react'
import styled, { css } from '@reshadow/macro'

const styles = css`
  /* container {
    border: 1px solid red;
  } */
`

class ReshadowPage extends React.Component<any> {
  state = { a: false }

  handleClick = () => {
    console.log('handleClick')
    this.setState({ a: !this.state.a })
  }

  render() {
    const { a } = this.state
    const i = a ? '2px' : '3px'
    return styled(styles)`
      container {
        border: ${i} solid green;
      }
    `(
      <container as="button" onClick={this.handleClick}>
        Dummy
      </container>,
    )
  }
}

export default ReshadowPage
